/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import SiteHeader from '../../components/site-header';
import CustomTable from '../../components/tables/table';
import { getBlocksAction } from '../../../actions/blocks';
import { getAccountShufflingsAction } from '../../../actions/shuffling';
import { getTransactionAction } from '../../../actions/transactions';
import ShufflingItem from './shuffling-item/'
import submitForm from '../../../helpers/forms/forms';
import { BlockUpdater } from '../../block-subscriber/index';
import { setBodyModalParamsAction } from '../../../modules/modals';


class MyShufling extends React.Component {
    constructor(props) {
        super(props);

        this.getBlocks = this.getBlocks.bind(this);

        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 14,
            blocks: null
        };
    }

    componentDidMount() {
        this.getAccountShufflings({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.getAccountShufflings({
                account: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    componentWillReceiveProps(newState) {
        this.getAccountShufflings({
            account: newState.account,
            firstIndex: newState.firstIndex,
            lastIndex: newState.lastIndex
        });
    }


    async getBlocks(requestParams) {
        const ledger = await this.props.getBlocksAction(requestParams);
        this.setState({
            ...this.props,
            blocks: ledger.blocks
        });
    }

    onPaginate(page) {
        this.setState({
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15 - 1
        }, () => {
            this.getBlocks({
                account: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            })
        });
    }

    getAccountShufflings = async (reqParams) => {
        const shufflings = await this.props.getAccountShufflingsAction({
            account: reqParams.account,
            firstIndex: reqParams.firstIndex,
            lastIndex: reqParams.lastIndex
        });

        if (shufflings) {
            this.setState({
                shufflings: shufflings.shufflings
            });
        }
    };

    getShufflers = async () => {
        const res = await this.props.submitForm({}, 'getShufflers');
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Transaction has been submitted!', null, 5000);
        }
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
                    pageTitle={'My shuffling'}
                />
                <div className="page-body container-fluid">
                    <div className="transaction-table">
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
                                }
                            ]}
                            className={'no-min-height'}
                            emptyMessage={'No active shuffling.'}
                            TableRowComponent={ShufflingItem}
                            tableData={this.state.shufflings}
                            passProps={{ getTransaction: this.getTransaction }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getBlocksAction: (requestParams) => dispatch(getBlocksAction(requestParams)),
    getAccountShufflingsAction: (requestParams) => dispatch(getAccountShufflingsAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyShufling);
