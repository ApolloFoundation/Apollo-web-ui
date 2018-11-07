/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import {connect} from 'react-redux';
import {getBlocksAction} from "../../../actions/blocks";
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'

import classNames from "classnames";
import ShufflingItem from '../active-shufflings/shuffling-item/'
import uuid from "uuid";
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import {getAccountShufflingsAction} from "../../../actions/shuffling";
import {BlockUpdater} from "../../block-subscriber/index";
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";

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

    onPaginate (page) {
        this.setState({
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
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
            lastIndex:  reqParams.lastIndex
        });

        if (shufflings) {
            this.setState({
                shufflings : shufflings.shufflings
            });
        }
    };

    getShufflers = async () => {
        const res = await this.props.submitForm( {}, 'getShufflers');
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

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My shuffling'}
                />
                <div className="page-body container-fluid">
                    <div className="transaction-table">
                        <div className="transaction-table no-min-height">
                            <ContentHendler
                                items={this.state.shufflings}
                                emptyMessage={'No shuffling found.'}
                            >
                                {
                                    this.state.shufflings && !!this.state.shufflings.length &&
                                    <div className="transaction-table-body">
                                        <table>
                                            <thead>
                                            <tr>
                                                <td>Code</td>
                                                <td>Name</td>
                                                <td>Type</td>
                                                <td className="align-right">Current Supply</td>
                                                <td className="align-right">Max Supply</td>
                                                <td className="align-right">Actions</td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.shufflings &&
                                                this.state.shufflings.map((el, index) => {
                                                    return (
                                                        <ShufflingItem
                                                            key={uuid()}
                                                            {...el}
                                                            getTransaction={this.getTransaction}
                                                        />
                                                    );
                                                })
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                }
                            </ContentHendler>
                        </div>
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
    getBlocksAction : (requestParams) => dispatch(getBlocksAction(requestParams)),
    getAccountShufflingsAction : (requestParams) => dispatch(getAccountShufflingsAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    getTransactionAction:     (requestParams) => dispatch(getTransactionAction(requestParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyShufling);