import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux'
import store, {history} from './store'
import App from './containers/app'

// import './index.css'

import {I18nextProvider} from 'react-i18next';
import BlockSubscriber from "./containers/block-subscriber";

const target = document.querySelector('#root');

// TODO: uncomment before production deploy
// console.warn  = function(message){};
// console.error = function(message){};

render(
    <Provider store={store}>
        <BlockSubscriber>
            <ConnectedRouter history={history}>
                <I18nextProvider>
                    <BrowserRouter>
                        <Switch>
                            <Route path="/" component={App}/>
                        </Switch>
                    </BrowserRouter>
                </I18nextProvider>
            </ConnectedRouter>
        </BlockSubscriber>
    </Provider>,
    target
);