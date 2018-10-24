/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import 'babel-polyfill';
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';
import store, {history} from './store';
import App from './containers/app';
import i18n from './i18n';
// import axios from 'axios';
import closest from './helpers/closest';

// import './index.css'

import {I18nextProvider} from 'react-i18next';
import BlockSubscriber from "./containers/block-subscriber";

const target = document.querySelector('#root');
//
// console.warn  = function(message){};
// console.error = function(message){};
// console.log = function(message){};

render(
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
            </ConnectedRouter>k
        </BlockSubscriber>
    </Provider>,
    target
);