/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import uuid from "uuid";
import classNames from "classnames";
import SiteHeader from "../../components/site-header";
import ShufflingItem from './shuffling-item';
import {getActiveShfflings, getFinishedShfflings} from '../../../actions/shuffling';
import {NotificationManager} from "react-notifications";
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber";

const mapStateToPropms = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getActiveShfflings  : (reqParams) => dispatch(getActiveShfflings(reqParams)),
    getFinishedShfflings: (reqParams) => dispatch(getFinishedShfflings(reqParams)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

class ActiveShufflings extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            activeShuffling: null
        }
    }

    listener = data => {
        this.getActiveShfflings({
            firstIndex: 0,
            lastIndex: 14
        });
        this.getFinishedShfflings({
            firstIndex: 0,
            lastIndex: 14
        });
    };

    componentDidMount() {
        NotificationManager.info('After creating or joining a shuffling, you must keep your node online and your shuffler running, leaving enough funds in your account to cover the shuffling fees, until the shuffling completes! If you don\'t and miss your turn, you will be fined.', null, 1000000);
        this.getActiveShfflings({
            firstIndex: 0,
            lastIndex: 14
        });
        this.getFinishedShfflings({
            firstIndex: 0,
            lastIndex: 14
        });
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    getFinishedShfflings   = async (reqParams) => {
        const finishedShufflings =  await this.props.getFinishedShfflings(reqParams);

        if (finishedShufflings) {
            this.setState({
                ...this.state,
                finishedShufflings: finishedShufflings.shufflings
            })
        }
    };

    getActiveShfflings   = async (reqParams) => {
        const activeShuffling =  await this.props.getActiveShfflings(reqParams);

        if (activeShuffling) {
            this.setState({
                ...this.state,
                activeShuffling: activeShuffling.shufflings
            })
        }
    };

    onPaginate = (page) => {
        this.setState({
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        }, () => {
            this.getActiveShfflings({
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            })
        });
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

    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Active Shuffling'}
                />
                <div className="page-body container-fluid">
                    <div className="transaction-table">
                        <div className="transaction-table no-min-height">
                            {
                                this.state.activeShuffling && !this.state.activeShuffling.length &&
                                <div className="info-box info">
                                    <p>After creating or joining a shuffling, you must keep your node online and your shuffler running, leaving enough funds in your account to cover the shuffling fees, until the shuffling completes! If you don't and miss your turn, you will be fined.</p>
                                </div>
                            }
                            {
                                this.state.activeShuffling && !!this.state.activeShuffling.length &&
                                <div className="transaction-table-body">
                                    <table>
                                        <thead>
                                        <tr>
                                            <td>Shuffling</td>
                                            <td>Stage</td>
                                            <td>Holding</td>
                                            <td>Amount</td>
                                            <td>Blocks Remaining</td>
                                            <td className="align-right">Participants</td>
                                            <td className="align-right">Assignee</td>
                                            <td className="align-right">Status</td>
                                        </tr>
                                        </thead>
                                        <tbody key={uuid()}>
                                        {
                                            this.state.activeShuffling &&
                                            this.state.activeShuffling.map((el, index) => {
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
                        </div>
                        <div className="form-group-app offset-bottom height-auto no-padding">
                            <div className="form-title padding-left padding-top">
                                <p>Finished Shufflings</p>
                            </div>
                            <div className="transaction-table no-min-height">
                                <div className="transaction-table-body offset-bottom">
                                    <table>
                                        <thead>
                                        <tr>
                                            <td>Shuffling</td>
                                            <td>Stage</td>
                                            <td>Holding</td>
                                            <td>Amount</td>
                                            <td className="align-right">Participants</td>
                                            <td className="align-right">Issuer</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.finishedShufflings &&
                                            this.state.finishedShufflings.map((el, index) => {
                                                return (
                                                    <ShufflingItem
                                                        key={uuid()}
                                                        finished
                                                        {...el}
                                                        getTransaction={this.getTransaction}
                                                    />
                                                );
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToPropms, mapDispatchToProps)(ActiveShufflings);