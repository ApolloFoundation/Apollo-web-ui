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
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'

import CustomTable from '../../components/tables/table';

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
                    <CustomTable
                        header={[
                            {
                                name: 'Date',
                                alignRight: false
                            },{
                                name: 'Type',
                                alignRight: true
                            },{
                                name: 'Amount',
                                alignRight: true
                            },{
                                name: 'Fee',
                                alignRight: false
                            },{
                                name: 'Account',
                                alignRight: true
                            },{
                                name: 'Judges',
                                alignRight: false
                            },{
                                name: 'Height',
                                alignRight: false
                            },{
                                name: 'Confirmations',
                                alignRight: false
                            },{
                                name: 'Actions',
                                alignRight: false
                            }
                        ]}
                        className={'mb-3'}
                        page={this.state.page}
                        emptyMessage={'No approval requests found.'}
                        TableRowComponent={Transaction}
                        tableData={this.state.transactions}
                    />
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