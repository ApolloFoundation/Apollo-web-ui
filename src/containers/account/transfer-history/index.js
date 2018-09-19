import React from 'react';
import SiteHeader from '../../components/site-header'
import TransferHistoryItem from './transfer-history-item'
import classNames from "classnames";
import uuid from "uuid";
import {connect} from 'react-redux'

import {getTransferHistory} from "../../../actions/assets";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getTransactionAction} from "../../../actions/transactions";
import {BlockUpdater} from "../../block-subscriber";
import {formatTimestamp} from "../../../helpers/util/time";


const mapStateToProps = state => ({
    account: state.account.account,
    accountRS: state.account.accountRS,
});

const mapDispatchToProps = dispatch => ({
    getTransferHistory: (requestParams) => dispatch(getTransferHistory(requestParams)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

class ScheduledTransactions extends React.Component {
    constructor(props) {
        super(props);

        this.getAssets = this.getAssets.bind(this);
        this.getTransaction = this.getTransaction.bind(this);
    }

    state = {
        transfers: null,
        page: 1,
        firstIndex: 0,
        lastIndex: 14,
    };

    componentWillMount() {
        this.getAssets({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            account: this.props.accountRS,
        });
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.getAssets({
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex,
                account: this.props.accountRS,
            });
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    componentWillReceiveProps() {

        this.getAssets({
            account: this.props.accountRS,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex
        })
    }

    onPaginate = (page) => {
        let reqParams = {
            ...this.props,
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        };

        this.setState(reqParams, () => {
            this.getAssets(reqParams)
        });
    };

    async getAssets(requestParams) {
        const transfers = await this.props.getTransferHistory(requestParams);

        if (transfers) {
            this.setState({
                ...this.props,
                transfers: transfers.transfers
            })
        }
    }

    async getTransaction(data) {
        const reqParams = {
            transaction: data,
            account: this.props.account
        };

        const transaction = await this.props.getTransactionAction(reqParams);
        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }

    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Transfer History'}
                />
                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Transaction</td>
                                        <td>Asset</td>
                                        <td>Date</td>
                                        <td className="align-right">Quantity</td>
                                        <td>Recipient</td>
                                        <td>Sender</td>
                                    </tr>
                                    </thead>
                                    <tbody key={uuid()}>
                                    {
                                        this.state.transfers &&
                                        this.state.transfers.map((el, index) => {
                                            return (
                                                <TransferHistoryItem
                                                    key={uuid()}
                                                    transfer={el}
                                                    setTransaction={this.getTransaction}
                                                />
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                                {
                                    this.state.transfers &&
                                    <div className="btn-box">
                                        <a
                                            className={classNames({
                                                'btn' : true,
                                                'btn-left' : true,
                                                'disabled' : this.state.page <= 1
                                            })}
                                            onClick={this.onPaginate.bind(this, this.state.page - 1)}
                                        > Previous</a>
                                        <div className='pagination-nav'>
                                            <span>{this.state.firstIndex + 1}</span>
                                            <span>&hellip;</span>
                                            <span>{this.state.lastIndex + 1}</span>
                                        </div>
                                        <a
                                            onClick={this.onPaginate.bind(this, this.state.page + 1)}
                                            className={classNames({
                                                'btn' : true,
                                                'btn-right' : true,
                                                'disabled' : this.state.transfers.length < 15
                                            })}
                                        >Next</a>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledTransactions);