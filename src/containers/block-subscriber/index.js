/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from "react";
import {connect} from "react-redux";
import {getBackendStatus, startBlockPullingAction} from "../../actions/blocks";
import {loadBlockchainStatus} from "../../actions/login";
import store from '../../store';

const EventEmitter = require("events").EventEmitter;
export const BlockUpdater = new EventEmitter();

class BlockSubscriber extends React.Component {
    interval = null;
    prevHeight = 0;
    state = {
        isPending: false,
        isPendingBlockchainStatus: false,
    };

    componentDidMount() {
        this.interval = setInterval(this.updateBlock, 4000);
        this.intervalBlockchainStatus = setInterval(this.updateBlockchainStatus, 60000);
    }

    updateBlockchainStatus = async () => {
        if (!this.state.isPendingBlockchainStatus) {
            this.setState({isPendingBlockchainStatus: true});
            await this.props.loadBlockchainStatus();
            this.setState({isPendingBlockchainStatus: false});
        }
    };

    updateBlock = async () => {
        if (!this.state.isPending) {
            this.setState({isPending: true});
            Promise.all([this.props.getBackendStatus(), startBlockPullingAction()])
                .then((values) => {
                    const blockData = values[1];
                    if (blockData) {
                        const currHeight = blockData.height;

                        store.dispatch({
                            type: 'SET_ACTUAL_BLOCK',
                            payload: {
                                actualBlock: currHeight,
                                timestamp: blockData.timestamp,
                            }
                        });

                        if (currHeight > this.prevHeight) {
                            this.prevHeight = currHeight;
                            BlockUpdater.emit("data", currHeight);
                        }
                    }
                    this.setState({isPending: false});
                });
        }
    };

    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.intervalBlockchainStatus);
    }

    render() {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    getBackendStatus: () => dispatch(getBackendStatus()),
    loadBlockchainStatus: () => dispatch(loadBlockchainStatus()),
});

export default connect(null, mapDispatchToProps)(BlockSubscriber)
