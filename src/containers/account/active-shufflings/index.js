/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from 'react-redux';
import uuid from "uuid";
import classNames from "classnames";
import SiteHeader from "../../components/site-header";
import ShufflingItem from './shuffling-item';
import { getActiveShfflings, getFinishedShfflings } from '../../../actions/shuffling';
import { NotificationManager } from "react-notifications";
import { getTransactionAction } from "../../../actions/transactions";
import { setBodyModalParamsAction } from "../../../modules/modals";
import { BlockUpdater } from "../../block-subscriber";
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'

import CustomTable from '../../components/tables/table';


const mapStateToPropms = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getActiveShfflings: (reqParams) => dispatch(getActiveShfflings(reqParams)),
    getFinishedShfflings: (reqParams) => dispatch(getFinishedShfflings(reqParams)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class ActiveShufflings extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            activeShuffling: null
        }
    }

    listener = data => {
        this.getActiveShfflings({
            firstIndex: 0,
            lastIndex: 14
        });
        this.getFinishedShfflings({
            firstIndex: 0,
            lastIndex: 14
        });
    };

    componentDidMount() {
        NotificationManager.info('After creating or joining a shuffling, you must keep your node online and your shuffler running, leaving enough funds in your account to cover the shuffling fees, until the shuffling completes! If you don\'t and miss your turn, you will be fined.', null, 1000000);
        this.getActiveShfflings({
            firstIndex: 0,
            lastIndex: 14
        });
        this.getFinishedShfflings({
            firstIndex: 0,
            lastIndex: 14
        });
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    getFinishedShfflings = async (reqParams) => {
        const finishedShufflings = await this.props.getFinishedShfflings(reqParams);

        if (finishedShufflings) {
            this.setState({
                ...this.state,
                finishedShufflings: finishedShufflings.shufflings
            })
        }
    };

    getActiveShfflings = async (reqParams) => {
        const activeShuffling = await this.props.getActiveShfflings(reqParams);

        if (activeShuffling) {
            this.setState({
                ...this.state,
                activeShuffling: activeShuffling.shufflings
            })
        }
    };

    onPaginate = (page) => {
        this.setState({
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15 - 1
        }, () => {
            this.getActiveShfflings({
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            })
        });
    };

    getTransaction = async (data) => {
        const reqParams = {
            transaction: data,
            account: this.props.account
        };

        const transaction = await this.props.getTransactionAction(reqParams);
        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }

    };

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Active Shuffling'}
                />
                <div className="page-body container-fluid">
                    <div className="active-polls white-space">
                        <div className="form-group-app offset-bottom height-auto no-padding mb-3">
                            <CustomTable
                                tableName='Active shufflings'
                                header={[
                                    {
                                        name: 'Shuffling',
                                        alignRight: false
                                    }, {
                                        name: 'Stage',
                                        alignRight: false
                                    }, {
                                        name: 'Holding',
                                        alignRight: false
                                    }, {
                                        name: 'Amount',
                                        alignRight: false
                                    }, {
                                        name: 'Blocks Remaining',
                                        alignRight: false
                                    }, {
                                        name: 'Participants',
                                        alignRight: true
                                    }, {
                                        name: 'Assignee',
                                        alignRight: true
                                    }, {
                                        name: 'Status',
                                        alignRight: true
                                    }
                                ]}
                                className={'no-min-height'}
                                emptyMessage={'No active shuffling.'}
                                TableRowComponent={ShufflingItem}
                                tableData={this.state.activeShuffling}
                                passProps={{ getTransaction: this.getTransaction }}
                            />
                        </div>

                        <div className="form-group-app offset-bottom height-auto no-padding mb-3">
                            <CustomTable
                                tableName='Finished shufflings'
                                header={[
                                    {
                                        name: 'Shuffling',
                                        alignRight: false
                                    }, {
                                        name: 'Stage',
                                        alignRight: false
                                    }, {
                                        name: 'Holding',
                                        alignRight: false
                                    }, {
                                        name: 'Amount',
                                        alignRight: false
                                    }, {
                                        name: 'Participants',
                                        alignRight: true
                                    }, {
                                        name: 'Assignee',
                                        alignRight: true
                                    }
                                ]}
                                className={'no-min-height'}
                                emptyMessage={'No finished shuffling.'}
                                TableRowComponent={ShufflingItem}
                                tableData={this.state.finishedShufflings}
                                passProps={{ getTransaction: this.getTransaction }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToPropms, mapDispatchToProps)(ActiveShufflings);
