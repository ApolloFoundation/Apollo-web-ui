/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios';
import config from 'config';
import submitForm from "helpers/forms/forms";

export function getPeersAction(requestParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getPeers',
                active: true,
                includePeerInfo: true,
                ...requestParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
            })
    }
}

export const getPeerAction = peerAddress => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: "getPeer",
            peer: peerAddress,
            random: Math.random()
        }
    })
        .then(res => {
            if (!res.data.errorCode) {
                return res.data;
            }
        })
};

export function getPeersInfoAction() {
    return dispatch => {
        return async () => {

            const peers = await dispatch(getPeersAction());

            if (peers && peers.peers) {
                return {
                    volumeDownloaded: peers.peers.map((el) => { return el.downloadedVolume}).reduce((a, b) => a + b, 0),
                    volumeUploaded: peers.peers.map((el) => { return el.uploadedVolume}).reduce((a, b) => a + b, 0),
                    connectedPeers: peers.peers.map((el) => {return el.state == 1}).length,
                    upToDatePeers: peers.peers.map((el) => { return el.blockchainState === "UP_TO_DATE"}).length,
                    peersVolume: peers.peers.length
                }
            }
        }
    }
}

export const addPeerAction = (requestParams) => (dispatch) => {
    return dispatch(submitForm.submitForm(requestParams, 'addPeer'))
};