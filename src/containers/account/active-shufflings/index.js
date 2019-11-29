/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import SiteHeader from "../../components/site-header";
import CustomTable from '../../components/tables/table';
import ShufflingItem from './shuffling-item';
import {getActiveShfflings} from '../../../actions/shuffling';
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber";


const mapStateToPropms = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getActiveShfflings: (reqParams) => dispatch(getActiveShfflings(reqParams)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class ActiveShufflings extends React.Component {
    state = {
        activeShuffling: null,
        page: 1,
        firstIndex: 0,
        lastIndex: 15,
    };

    listener = data => {
        this.getActiveShfflings({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    };

    componentDidMount() {
        NotificationManager.info('After creating or joining a shuffling, you must keep your node online and your shuffler running, leaving enough funds in your account to cover the shuffling fees, until the shuffling completes! If you don\'t and miss your turn, you will be fined.', null, 1000000);
        this.getActiveShfflings({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    getActiveShfflings = async (reqParams, pagination) => {
        const activeShuffling = await this.props.getActiveShfflings(reqParams);

        if (activeShuffling) {
            this.setState({
                ...pagination,
                activeShuffling: activeShuffling.shufflings
            })
        }
    };

    onPaginate = (page) => {
        const pagination = {
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15
        };
        this.getActiveShfflings({
            firstIndex: pagination.firstIndex,
            lastIndex: pagination.lastIndex
        }, pagination);
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
                    <CustomTable
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
                        className={'no-min-height mb-3'}
                        emptyMessage={'No active shuffling.'}
                        TableRowComponent={ShufflingItem}
                        tableData={this.state.activeShuffling}
                        passProps={{getTransaction: this.getTransaction}}
                        isPaginate
                        page={this.state.page}
                        previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                        nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                        itemsPerPage={15}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToPropms, mapDispatchToProps)(ActiveShufflings);
