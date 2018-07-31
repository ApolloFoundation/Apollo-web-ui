import React from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';
import SiteHeader from  '../../components/site-header'
import {getPoolsAction} from "../../../actions/pools";

import FinishedPoolsItem from "./finished-pools-item";
import classNames from "classnames";
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";


class FinishedPools extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstIndex: 0,
            lastIndex: 14,
            page: 1,
            activePools: null,
            finishedPools: null
        };

        this.getFinishedPools = this.getFinishedPools.bind(this);
        this.getTransaction   = this.getTransaction.bind(this);
    }

    componentDidMount() {
        this.getFinishedPools({
            firstIndex: 0,
            lastIndex:  9,
        });

    }

    componentWillReceiveProps(newState) {
        this.getFinishedPools();
    }

    async getFinishedPools(reqParams){
        reqParams = {
            ...reqParams,
            finishedOnly: true,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex
        };

        const finishedPools = await this.props.getPoolsAction(reqParams);

        if (finishedPools) {
            this.setState({
                ...this.props,
                finishedPools: finishedPools.polls
            });
        }
    }

    onPaginate (page) {
        let reqParams = {
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        };

        this.setState(reqParams, () => {
            this.getFinishedPools(reqParams)
        });
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
                    pageTitle={'Finished Polls'}
                />
                <div className="page-body container-fluid">
                    <div className="account-ledger">
                        <div className="transaction-table no-min-height">
                            <div className="transaction-table-body offset-bottom">
                                <table>
                                    <thead  key={uuid()}>
                                        <tr key={uuid()}>
                                            <td>Title</td>
                                            <td>Description</td>
                                            <td>Sender</td>
                                            <td>Start date</td>
                                            <td>Blocks left</td>
                                            <td className="align-right">Actions</td>
                                        </tr>
                                    </thead>
                                    <tbody key={uuid()}>
                                        {
                                            this.state.finishedPools &&
                                            this.state.finishedPools.map((el, index) => {
                                                return (
                                                    <FinishedPoolsItem
                                                        {...el}
                                                        activePools
                                                        getTransaction={this.getTransaction}
                                                    />
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                                {
                                    this.state.finishedPools &&
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
                                                'disabled' : this.state.finishedPools.length < 15
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

const mapStateToProps = state => ({
    account: state.account.account,

    // modals
    modalData: state.modals.modalData
});

const initMapDispatchToProps = dispatch => ({
    getPoolsAction: (reqParams) => dispatch(getPoolsAction(reqParams)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

export default connect(
    mapStateToProps,
    initMapDispatchToProps
)(FinishedPools);
