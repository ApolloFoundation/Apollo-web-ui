import axios from 'axios';
import config from 'config';

const initState = {
    assetsPage: 1
};

const SET_ASSETS = 'SET_ASSETS';
const SET_ASSETS_PAGE = 'SET_ASSETS_PAGE';

export default (state = initState, action) => {
    switch (action.type) {
        case SET_ASSETS: 
            return {
                ...state,
                assets: action.payload
            }
        case SET_ASSETS_PAGE: 
            return {
                ...state,
                assetsPage: action.payload
            }
        default: return state;
    }
}

export const getAssets = (page) => dispatch => {
    var reqParams;

    if (!page) {
        reqParams = {
            firstIndex: 0,
            lastIndex: 15
        }
    } else {
        reqParams = {
            firstIndex: page * 15 - 15,
            lastIndex: page * 15
        }
    }

    axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getAllAssets',
            includeCounts: true,
            ...reqParams,
        }
    })
        .then(res => {
            if (res.data.assets) {
                dispatch({
                    type: SET_ASSETS,
                    payload: res.data.assets
                })
            }
            if (page) {
                dispatch({
                    type: SET_ASSETS_PAGE,
                    payload: page
                })
            }
        })
} 