import * as E from "electron";
import { Component } from "react";
import { h } from 'preact';
const { observer, connect } = require('mobx-preact');

import * as Const from "Const";
import Panel from "./toppanel";
import './style.scss'

interface TopPanelProps {
    tabs?: ITabsStore
}

@connect(['tabs'])
@observer
class TopPanel extends Component<TopPanelProps, {}> {
    props: TopPanelProps;

    constructor(props: TopPanelProps) {
        super(props);

        this.props = props;
    }

    private onMainTab = (e: React.MouseEvent<HTMLDivElement> & Event) => {
        e.stopImmediatePropagation();
        e.stopPropagation();

        E.ipcRenderer.send(Const.MAINTAB);
        this.props.tabs!.setFocus(1);
    }

    private onHomeClick = (event: React.MouseEvent<HTMLDivElement> & Event) => {
        E.ipcRenderer.send(Const.TOHOME);
    }
    
    private onUpdateFonts = (event: React.MouseEvent<HTMLDivElement> & Event) => {
        E.ipcRenderer.send(Const.UPDATEFONTS);
    }

    render() {
        return (
            <Panel
                current={this.props.tabs!.current}
                onMainTab={this.onMainTab}
                onUpdateFonts={this.onUpdateFonts}
                onHomeClick={this.onHomeClick}
                getTab={this.props.tabs!.getTab}
            />
        );
    }
}

export default TopPanel;