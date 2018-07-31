import config from '../../config';
import axios from 'axios';

export function getPoolsAction (reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl , {
            params: {
                requestType: 'getPolls',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorMessage) {
                    return res.data;
                }
                return res.data.errorMessage
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export function getPoolAction (reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl , {
            params: {
                requestType: 'getPoll',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorMessage) {
                    return res.data;
                }
                return res.data.errorMessage
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export function getPollResultAction (reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl , {
            params: {
                requestType: 'getPollResult',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorMessage) {
                    return res.data;
                }
                return res.data.errorMessage
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export function getPollVotesAction (reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl , {
            params: {
                requestType: 'getPollVotes',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorMessage) {
                    return res.data;
                }
                return res.data.errorMessage
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

