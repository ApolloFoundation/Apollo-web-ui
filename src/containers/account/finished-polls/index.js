/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from 'react-redux';
import SiteHeader from  '../../components/site-header';
import CustomTable from '../../components/tables/table';
import {getpollsAction} from "../../../actions/polls";
import {getTransactionAction} from "../../../actions/transactions";
import {BlockUpdater} from "../../block-subscriber";
import FinishedpollsItem from "./finished-pools-item";
import {setBodyModalParamsAction} from "../../../modules/modals";


class Finishedpolls extends React.Component {
    state = {
        finishedpolls: null,
        page: 1,
        firstIndex: 0,
        lastIndex: 14,
    };

    listener = data => {
        this.getFinishedpolls({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        })
    };

    componentDidMount() {
        this.getFinishedpolls({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    getFinishedpolls = async (reqParams, pagination) => {
        reqParams = {
            ...reqParams,
            finishedOnly: true,
        };

        const finishedpolls = await this.props.getpollsAction(reqParams);

        if (finishedpolls) {
            this.setState({
                ...pagination,
                finishedpolls: finishedpolls.polls
            });
        }
    };

    onPaginate = (page) => {
        const pagination = {
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15 - 1
        };
        this.getFinishedpolls({
            firstIndex: pagination.firstIndex,
            lastIndex: pagination.lastIndex
        }, pagination);
    };

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
