/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from "react";
import {startBlockPullingAction} from "../../actions/blocks/index";
import {loadBlockchainStatus} from "../../actions/login/index";
import store from '../../store'


const EventEmitter = require("events").EventEmitter;


export const BlockUpdater = new EventEmitter();

export default class BlockSubscriber extends React.Component {

    interval = "";

    prevHeight = 0;

    componentDidMount() {
        this.interval = setInterval(this.updateBlock, 4000)
    }


    updateBlock = async () => {
        let blockData = startBlockPullingAction();
        let blockChainStatus = store.dispatch(loadBlockchainStatus());

        Promise.all([blockData, blockChainStatus])
            .then((data) => {

                blockData = data[0];
                blockChainStatus = data[1];

                console.log(data);

                if (blockData) {
                    const currHeight = blockData.height;

                    store.dispatch({
                        type: 'SET_ACTUAL_BLOCK',
                        payload: currHeight
                    });

                    const {account} = store.getState();

                    if (currHeight > this.prevHeight) {
                        this.prevHeight = currHeight;
                        BlockUpdater.emit("data", currHeight);
                    }
                }
            });
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        )
    }
}