import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import * as E from "electron";
import * as url from "url";

import Fonts from "../Fonts";
import Tabs from "./Tabs";
import shortcuts from "../shortcuts";
import * as Const from "Const";
import {
    isDev,
    winUrlDev,
    winUrlProd,
} from "Utils";

interface IWindowManager {
    home: string;
    mainWindow: E.BrowserWindow;

    getZoom(): Promise<number>;
    setZoom(zoom: number): void;
    openUrl(url: string): void;
    reloadAllWindows(): void;
}

class WindowManager implements IWindowManager {
    home: string;
    mainWindow: E.BrowserWindow;

    constructor(options: E.BrowserWindowConstructorOptions, home: string) {
        this.home = home;

        this.mainWindow = new E.BrowserWindow(options);
        this.mainWindow.loadURL(isDev ? winUrlDev : winUrlProd);

        this.addTab('loadMainContetnt.js');

        this.mainWindow.on('resize', this.updateBuonds);
        this.mainWindow.on('maximize', (e: Event) => setTimeout(() => this.updateBuonds(e), 100));
        this.mainWindow.on('unmaximize', (e: Event) => setTimeout(() => this.updateBuonds(e), 100));
        this.mainWindow.on('move', (e: Event) => setTimeout(() => this.updateBuonds(e), 100));

        shortcuts();

        isDev && this.devtools();
        isDev && this.mainWindow.webContents.openDevTools({ mode: 'detach' });

        this.addIpc();
    }

    reloadAllWindows = () => {}

    getZoom = (): Promise<number> => new Promise((resolve) => {
        this.mainWindow.webContents.getZoomFactor(z => resolve(z));
    });

    setZoom = (zoom: number) => {
        const tabs = Tabs.getAll();

        this.mainWindow.webContents.setZoomFactor(zoom);

        tabs.forEach(t => t.webContents.setZoomFactor(zoom));
    };

    openUrl = (url: string) => {
        if (/figma:\/\//.test(url)) {
            this.addTab('loadContetnt.js', url.replace(/figma:\//, Const.HOMEPAGE), false);
        } else if (/https?:\/\//.test(url)) {
            this.addTab('loadContetnt.js', url, false);
        }
    }


    private addIpc = () => {
        E.ipcMain.on(Const.NEWTAB, async () => this.addTab('loadMainContetnt.js'));

        E.ipcMain.on(Const.CLOSETAB, (event: Event, id: number) => {
            const views = Tabs.getAll();
            const index: number = views.findIndex(t => t.id == id);
            const view = Tabs.focus(views[index > 0 ? index-1 : index].id);
            this.mainWindow.setBrowserView(view);

            Tabs.close(id);
        });

        E.ipcMain.on(Const.FOCUSTAB, (event: Event, id: number) => {
            const view = Tabs.focus(id);
            this.mainWindow.setBrowserView(view);
        });

        E.ipcMain.on(Const.MAINTAB, (event: Event) => {
            const view = Tabs.focus(1);
            this.mainWindow.setBrowserView(view);
        });

        E.ipcMain.on(Const.CLOSEALLTAB, () => {
            console.log('Close all tab');
        });

        E.ipcMain.on(Const.SETTITLE, (event: Event, title: string) => {
            this.mainWindow.webContents.send(Const.SETTITLE, { id: this.mainWindow.getBrowserView()!.id, title })
        });

        E.ipcMain.on(Const.UPDATEFILEKEY, (event: Event, key: string) => {
            this.mainWindow.webContents.send(Const.UPDATEFILEKEY, { id: this.mainWindow.getBrowserView()!.id, fileKey: key })
        });

        E.ipcMain.on(Const.TOHOME, (event: Event, title: string) => {
            const currentView = this.mainWindow.getBrowserView();
            const currentUrl = currentView && currentView.webContents.getURL() || '';
            const go: boolean = url.parse(currentUrl).pathname !== '/files/recent';

            currentView && go && currentView!.webContents.loadURL(`${this.home}`);
        });

        E.ipcMain.on(Const.UPDATEFONTS, (event: Event) => {
            
            const fonts = Fonts.updateFonts();
            
            const views = E.BrowserView.getAllViews();
            views.forEach(view => {
                view.webContents.send(Const.UPDATEFONTS, fonts);
            });

            this.mainWindow.webContents.send(Const.UPDATEFONTS, fonts);
        });
    }

    private addTab = (scriptPreload: string, url: string = `${this.home}/login`, showBackBtn: boolean = true) => {
        const tab = Tabs.newTab(url, this.getBounds(), scriptPreload);

        this.mainWindow.setBrowserView(tab);
        tab.webContents.on('will-navigate', this.onMainWindowWillNavigate);
        tab.webContents.on('new-window', this.onNewWindow);

        this.mainWindow.webContents.send(Const.TABADDED, { id: tab.id, url: `${this.home}/login`, showBackBtn});
    }

    private onNewWindow = (event: Event, url: string) => {
        let view;

        if (/start_google_sso/.test(url)) return;
            
        view = Tabs.newTab(`${url}`, this.getBounds(), 'loadContetnt.js');
        
        view.webContents.on('will-navigate', this.onMainWindowWillNavigate);

        this.mainWindow.setBrowserView(view);
        this.mainWindow.webContents.send(Const.TABADDED, { id: view.id, url, showBackBtn: false});
    }

    private onMainWindowWillNavigate = (event: E.Event, newUrl: string) => {
        const currentUrl = event.sender.getURL();

        if (newUrl === currentUrl) {
            event.preventDefault();
            return;
        }

        const from = url.parse(currentUrl);
        const to = url.parse(newUrl);

        if (from.pathname === '/login') {
            Tabs.reloadAll();

            event.preventDefault();
            return;
        }

        if (to.pathname === '/logout') {
            E.net.request(`${this.home}/logout`).on('response', response => {
                response.on('data', data => {});
                response.on('error', (err: Error) => {
                    console.log('Request error: ', err);
                });
                response.on('end', () => {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {

                        E.session.defaultSession!.cookies.flushStore(() => {
                            const view = Tabs.focus(1);
                            this.mainWindow.setBrowserView(view);
                            view.webContents.reload();

                            Tabs.closeAll();

                            this.mainWindow.webContents.send(Const.CLOSEALLTAB);
                        });
                    }

                    if (response.statusCode >= 400) {
                        E.session.defaultSession!.clearStorageData();
                        this.mainWindow.webContents.loadURL(`${this.home}`);
                    }
                });
            }).end();

            event.preventDefault();
            return;
        }
    }

    private getBounds = () => ({
        x: 0,
        y: Const.TOPPANELHEIGHT,
        width: this.mainWindow.getContentBounds().width,
        height: this.mainWindow.getContentBounds().height - Const.TOPPANELHEIGHT
    })

    private updateBuonds = (event?: Event) => E.BrowserView.getAllViews().forEach(bw => bw.setBounds(this.getBounds()))

    private devtools = () => {
		installExtension(REACT_DEVELOPER_TOOLS)
			.then((name) => console.log(`Added Extension:  ${name}`))
			.catch((err) => console.log('An error occurred: ', err));
    }
}

export default WindowManager;
export {
    IWindowManager
}
