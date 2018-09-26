/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import {connect} from "react-redux";
import {getApprovesAction} from "../../../actions/approval-requests";
import {BlockUpdater} from "../../block-subscriber";
import Block from "../blocks/block";
import uuid from "uuid";
import classNames from "classnames";
import Transaction from "./transaction/index";

class ApprovalRequests extends React.Component {
    state = {
        transactions: []
    };

    componentWillMount() {
        this.getApproves(this.props.account);
    }

    componentDidMount() {
        BlockUpdater.on("data", this.listener);
    };

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener);
    };

    listener = data => {
        this.getApproves(this.props.account);
    };

    getApproves = async account => {
        const approves = await this.props.getApproveRequests(account) || {};
        this.setState({
            transactions: approves.transactions ? approves.transactions : []
        })
    };

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Approval requests (account)'}
                />
                <div className="page-body container-fluid">
                    <div className="approval-request white-space">
                        {this.state.transactions.length > 0 ?
                            <div className="transaction-table">
                                <div className="transaction-table-body">
                                    <table>
                                        <thead>
                                        <tr>
                                            <td>Date</td>
                                            <td className="align-left">Type</td>
                                            <td className="align-right">Amount</td>
                                            <td>Fee</td>
                                            <td className="align-left">Account</td>
                                            <td>Judges</td>
                                            <td>Height</td>
                                            <td>Confirmations</td>
                                            <td>Actions</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.transactions.map(el => {
                                                return (
                                                    <Transaction
                                                        key={uuid()}
                                                        transaction={el}
                                                    />
                                                );
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div> :
                            <div className="alert">No current approval requests.</div>}
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    getApproveRequests: account => dispatch(getApprovesAction(account)),
});

const mapStateToProps = state => ({
    account: state.account.account,
});

export default connect(mapStateToProps, mapDispatchToProps)(ApprovalRequests);