/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from "../../components/site-header";
import CustomTable from '../../components/tables/table';
import ShufflingItem from './../active-shufflings/shuffling-item';
import {getFinishedShfflings} from '../../../actions/shuffling';
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber";


const mapStateToPropms = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getFinishedShfflings: (reqParams) => dispatch(getFinishedShfflings(reqParams)),
    getTransactionAction: (type, data) => dispatch(getTransactionAction(type, data)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class FinishedShufflings extends React.Component {
    state = {
        finishedShufflings: null,
        page: 1,
        firstIndex: 0,
        lastIndex: 15,
    };

    listener = data => {
        this.getFinishedShfflings({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        })
    };

    componentDidMount() {
        this.getFinishedShfflings({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener);
    }

    getFinishedShfflings = async (reqParams, pagination) => {
        const finishedShufflings = await this.props.getFinishedShfflings(reqParams);

        if (finishedShufflings) {
            this.setState({
                ...pagination,
                finishedShufflings: finishedShufflings.shufflings,
            })
        }
    };

    onPaginate = (page) => {
        const pagination = {
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15
        };
        this.getFinishedShfflings({
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
                    pageTitle={'Finished Shuffling'}
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
                                name: 'Participants',
                                alignRight: true
                            }, {
                                name: 'Issuer',
                                alignRight: true
                            }
                        ]}
                        className={'no-min-height mb-3'}
                        emptyMessage={'No finished shuffling.'}
                        TableRowComponent={ShufflingItem}
                        tableData={this.state.finishedShufflings}
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

export default connect(mapStateToPropms, mapDispatchToProps)(FinishedShufflings);