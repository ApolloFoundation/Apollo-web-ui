/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk';
import rootReducer from './modules'

const initialState = {};
const enhancers = [];

if (process.env.NODE_ENV === 'development') {
	const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

	if (typeof devToolsExtension === 'function') {
		enhancers.push(devToolsExtension())
	}
}

const composedEnhancers = compose(
	applyMiddleware(thunkMiddleware),
	...enhancers
);

const store = createStore(
	rootReducer,
	initialState,
	composedEnhancers
);

export default store
