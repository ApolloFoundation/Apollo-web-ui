/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';
import SiteHeader from  '../../components/site-header'
import {getpollsAction} from "../../../actions/polls";
import {BlockUpdater} from "../../block-subscriber";
import FinishedpollsItem from "./finished-pools-item";
import classNames from "classnames";
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'

import CustomTable from '../../components/tables/table';

class Finishedpolls extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstIndex: 0,
            lastIndex: 14,
            page: 1,
            activepolls: null,
            finishedpolls: null
        };

        this.getFinishedpolls = this.getFinishedpolls.bind(this);
        this.getTransaction   = this.getTransaction.bind(this);
    }

    listener = data => {
        this.getFinishedpolls()
    };

    componentDidMount() {
        this.getFinishedpolls({
            firstIndex: 0,
            lastIndex:  9,
        });
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    componentWillReceiveProps(newState) {
        this.getFinishedpolls();
    }

    async getFinishedpolls(reqParams){
        reqParams = {
            ...reqParams,
            finishedOnly: true,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex
        };

        const finishedpolls = await this.props.getpollsAction(reqParams);

        if (finishedpolls) {
            this.setState({
                ...this.props,
                finishedpolls: finishedpolls.polls
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
            this.getFinishedpolls(reqParams)
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
                    <CustomTable 
                        header={[
                            {
                                name: 'Title',
                                alignRight: false
                            },{
                                name: 'Description',
                                alignRight: false
                            },{
                                name: 'Sender',
                                alignRight: false
                            },{
                                name: 'Start date',
                                alignRight: false
                            },{
                                name: 'Blocks left',
                                alignRight: false
                            },{
                                name: 'Actions',
                                alignRight: true
                            }
                        ]}
                        className={'no-min-height mb-3'}
                        emptyMessage={'No finished polls.'}
                        TableRowComponent={(el) => <FinishedpollsItem {...el} activepolls getTransaction={this.getTransaction}/>}
                        tableData={this.state.finishedpolls}
                        hintClassName={'mt-4'}
                        isPaginate
                        page={this.state.page}
                        previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                        nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                    />
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
    getpollsAction: (reqParams) => dispatch(getpollsAction(reqParams)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(
    mapStateToProps,
    initMapDispatchToProps
)(Finishedpolls);
