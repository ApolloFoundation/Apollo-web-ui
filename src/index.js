import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';
import store, {history} from './store';
import App from './containers/app';
import i18n from './i18n';
import BrowserDetection from 'react-browser-detection';

// import './index.css'

import {I18nextProvider} from 'react-i18next';
import BlockSubscriber from "./containers/block-subscriber";
import classNames from "classnames";

const target = document.querySelector('#root');

// TODO: uncomment before production deploy
// console.warn  = function(message){};
// console.error = function(message){};
// console.log = function(message){};


const next =
    <Provider store={store}>
        <BlockSubscriber>
            <ConnectedRouter history={history}>
                <I18nextProvider  i18n={ i18n }>
                    <BrowserRouter>
                        <Switch>
                            <Route path="/" component={App}/>
                        </Switch>
                    </BrowserRouter>
                </I18nextProvider>
            </ConnectedRouter>
        </BlockSubscriber>
    </Provider>;

const depricationAlert = (browser) => (
    <div className={'deprication-container'}>
        <div className="page-content">
            <div className="page-body container-fluid">
                <div className="login">
                    <div className="modal-form">
                        <div className="form-group-app" style={{boxShadow: '0 0 30px #000'}}>
                            <div className="form-title">
                                <p>Warning</p>
                            </div>
                            <p>
                                Apollo web wallet is temporary unavailable for this browser
                            </p>
                            {/*<ul className={'allowlist'} style={{paddingTop: 15}}>*/}
                                {/*<li>Chrome</li>*/}
                                {/*<li>Firefox</li>*/}
                                {/*<li>Opera</li>*/}
                                {/*<li>Safari</li>*/}
                                {/*<li>Edge</li>*/}
                            {/*</ul>*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )


const browserHandler = {
    chrome: () => next,
    firefox: () => next,
    safari: () => next,
    opera: () => next,
    googlebot: () => next,
    ie: () => depricationAlert(browser),
    edge: () => next,
    default: () => next,
};

render(
    <React.Fragment>
        <BrowserDetection>
            {browserHandler}
        </BrowserDetection>
    </React.Fragment>,
    target
);