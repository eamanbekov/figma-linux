import { h } from 'preact';

import Tabs from "Components/Tabs";

interface TopPanelProps {
    current: number;

    onMainTab(e: React.MouseEvent<HTMLDivElement>): void;
    onUpdateFonts(e: React.MouseEvent<HTMLDivElement>): void;
    onHomeClick(e: React.MouseEvent<HTMLDivElement>): void;
    getTab(id: Number): Tab | undefined;
}

function TopPanel(props: TopPanelProps) {
    const currentTab: Tab | undefined = props.getTab(props.current);

    return (
        <div className="panel">
            <div className="panelButtons gridArea-a">
                <div className={`button main ${props.current === 1 ? 'active' : ''}`} onClick={e => props.onMainTab(e)}>
                    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 1H1v6h6V1zM6 2H2v4h4V2zm9-1H9v6h6V1zm-1 1h-4v4h4V2zm1 7H9v6h6V9zm-1 1h-4v4h4v-4zM7 9H1v6h6V9zm-1 1H2v4h4v-4z" fill-rule="evenodd" fill="#fff"></path>
                    </svg>
                </div>
                {(!currentTab) || (!!currentTab && currentTab.showBackBtn) ? 
                    <div className="button home" onClick={e => props.onHomeClick(e)}>
                        <svg x="0px" y="0px" viewBox="0 0 489 489" width="16px" height="16px">
                            <g>
                                <path d="M429.4,255.033c-35.4-43.1-102.1-94.4-219.7-98.8v-79.8c0-4.7-2.7-9.1-7-11.1s-9.4-1.4-13,1.6L4.5,219.633   c-2.8,2.3-4.5,5.8-4.5,9.4c0,3.7,1.6,7.1,4.4,9.4l185.2,153.3c3.7,3,8.7,3.7,13,1.6c4.3-2,7-6.3,7-11.1v-79.5   c76.8,0.3,194.2,6,256.5,115.9c2.2,3.9,6.3,6.2,10.7,6.2c1,0,2.1-0.1,3.1-0.4c5.4-1.4,9.1-6.3,9.1-11.8   C489.1,371.533,473.4,308.633,429.4,255.033z M197.4,278.233L197.4,278.233c-3.3,0-6.4,1.3-8.7,3.6s-3.6,5.4-3.6,8.7v65.7   l-153.5-127.1l153.6-126.7v65.7c0,6.7,5.4,12.2,12.1,12.3c176,1.7,241.6,109,260.7,184.4   C382.2,278.333,268.7,278.233,197.4,278.233z"
                                    fill="#FFFFFF" />
                            </g>
                        </svg>
                    </div> : null
                }
            </div>
            <Tabs/>
            <div className="gridArea-c">
                <div className={`button menu`} onClick={e => props.onUpdateFonts(e)}>
                    <svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 100 100" enable-background="new 0 0 100 100">
                        <path fill="#FFFFFF" d="M65.537,72.39c-4.81,3.368-10.428,5.062-16.179,4.98c-0.758-0.011-1.514-0.045-2.261-0.113  c-0.304-0.028-0.611-0.079-0.917-0.119c-0.585-0.073-1.17-0.153-1.747-0.267c-0.352-0.068-0.695-0.154-1.042-0.238  c-0.562-0.131-1.119-0.262-1.666-0.427c-0.265-0.079-0.521-0.176-0.781-0.261c-0.634-0.21-1.261-0.432-1.872-0.688  c-0.14-0.057-0.273-0.119-0.412-0.182c-0.716-0.313-1.42-0.647-2.104-1.018c-0.031-0.016-0.06-0.034-0.091-0.051  c-2.315-1.266-4.431-2.851-6.285-4.703c-0.031-0.033-0.06-0.067-0.091-0.097c-0.573-0.579-1.124-1.188-1.647-1.817  c-0.112-0.131-0.215-0.278-0.326-0.415c-3.78-4.725-6.058-10.706-6.058-17.216h7.271L17.695,32.312L6.063,49.76h7.271  c0,7.651,2.385,14.74,6.436,20.602c0.051,0.086,0.085,0.17,0.142,0.25c0.421,0.602,0.886,1.153,1.334,1.721  c0.17,0.216,0.324,0.438,0.5,0.647c0.665,0.802,1.369,1.563,2.091,2.301c0.067,0.068,0.134,0.142,0.205,0.21  c2.431,2.438,5.174,4.487,8.165,6.123c0.082,0.046,0.159,0.097,0.241,0.137c0.864,0.465,1.745,0.887,2.648,1.278  c0.222,0.097,0.44,0.204,0.664,0.301c0.773,0.318,1.558,0.597,2.352,0.857c0.375,0.132,0.75,0.262,1.13,0.375  c0.692,0.21,1.403,0.38,2.119,0.551c0.474,0.108,0.945,0.228,1.428,0.324c0.199,0.04,0.389,0.097,0.589,0.13  c0.675,0.12,1.351,0.188,2.024,0.268c0.245,0.029,0.482,0.074,0.73,0.097c1.209,0.119,2.42,0.199,3.626,0.199  c7.393,0,14.601-2.262,20.786-6.595c1.971-1.381,2.454-4.101,1.067-6.072C70.229,71.486,67.503,71.009,65.537,72.39z"></path>
                        <path fill="#FFFFFF" d="M86.043,49.76c-0.006-7.622-2.374-14.7-6.407-20.55c-0.057-0.097-0.097-0.199-0.165-0.295  c-0.5-0.713-1.045-1.38-1.591-2.051c-0.062-0.079-0.119-0.165-0.187-0.244c-3.687-4.475-8.322-7.934-13.57-10.196  c-0.147-0.062-0.29-0.13-0.432-0.193c-0.84-0.346-1.697-0.653-2.561-0.938c-0.313-0.105-0.619-0.216-0.932-0.312  c-0.756-0.227-1.517-0.409-2.29-0.59c-0.426-0.096-0.846-0.205-1.278-0.29c-0.209-0.039-0.414-0.103-0.623-0.142  c-0.574-0.1-1.148-0.143-1.728-0.216c-0.397-0.051-0.79-0.114-1.187-0.154c-0.967-0.091-1.927-0.13-2.887-0.145  c-0.175-0.002-0.343-0.025-0.516-0.025c-0.034,0-0.063,0.008-0.094,0.012c-7.381,0.005-14.578,2.232-20.755,6.561  c-1.974,1.38-2.453,4.102-1.069,6.075c1.379,1.973,4.1,2.453,6.074,1.07c4.771-3.34,10.341-5.035,16.049-4.981  c0.818,0.005,1.626,0.045,2.425,0.122c0.244,0.025,0.488,0.062,0.733,0.094c0.659,0.079,1.312,0.17,1.948,0.295  c0.283,0.057,0.562,0.131,0.84,0.193c0.631,0.143,1.261,0.296,1.875,0.483c0.192,0.057,0.386,0.13,0.578,0.193  c0.705,0.23,1.398,0.478,2.074,0.762c0.068,0.028,0.136,0.063,0.204,0.09c4.067,1.75,7.635,4.442,10.417,7.811  c0.018,0.02,0.034,0.045,0.052,0.064c3.913,4.769,6.271,10.863,6.276,17.497h-7.276l11.639,17.449L93.308,49.76H86.043z"></path>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default TopPanel;