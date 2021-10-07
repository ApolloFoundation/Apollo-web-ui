/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import "core-js/stable";
import "regenerator-runtime/runtime";
import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';
import store from './store';
import App from './containers/app';
import BlockSubscriber from "./containers/block-subscriber";

const target = document.querySelector('#root');

console.warn  = function(message){};
console.error = function(message){};

ReactDOM.render(
    <Provider store={store}>
        <BlockSubscriber>
                <I18nextProvider i18n={i18n}>
                    <Router>
                        <Switch>
                        <Route path="/" component={App}/>
                        </Switch>
                    </Router>
                </I18nextProvider>
        </BlockSubscriber>
    </Provider>,
    target
);
