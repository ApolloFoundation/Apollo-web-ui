/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import uuid from 'uuid';
import SiteHeader from  '../../components/site-header'
import Entry from './entry'
import { getAccountLedgerAction, getLedgerEntryAction } from "../../../actions/ledger";
import { setModalCallback, setBodyModalParamsAction } from "../../../modules/modals";
import {getTransactionAction} from "../../../actions/transactions/";
import curve25519 from "../../../helpers/crypto/curve25519";
import converters from "../../../helpers/converters";
import crypto from "../../../helpers/crypto/crypto";
import {BlockUpdater} from "../../block-subscriber";
import ContentLoader from '../../components/content-loader'
import InfoBox from '../../components/info-box';
import ContentHendler from '../../components/content-hendler'

class Ledger extends React.Component {
    constructor(props) {
        super(props);

        this.getAccountLedger = this.getAccountLedger.bind(this);
        this.getPrivateEntries = this.getPrivateEntries.bind(this);
        this.getLedgerEntry = this.getLedgerEntry.bind(this);


        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 14,
            ledger: null
        };
    }

    listener = data => {
        this.getAccountLedger({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            passphrase: this.state.passphrase,
            includeHoldingInfo: true
        });
    };

    componentDidMount() {
        this.getAccountLedger({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            includeHoldingInfo: true
        });
        this.props.setModalCallbackAction(this.getPrivateEntries);
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    componentWillReceiveProps(newState) {
        this.setState({
            ...newState,
            passphrase:  this.state.passphrase,
        }, () => {
            this.getAccountLedger({
                passphrase:  this.state.passphrase,
                account: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex,
                includeHoldingInfo: true
            });
        });
    }

    getPrivateEntries = (data) => {
        console.log(data);

        let reqParams = {
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            includeHoldingInfo: true,
            ...data
        };

        if (data) {

            this.setState({
                passphrase:  data,
            });
        }

        console.log(reqParams);

        this.getAccountLedger(reqParams);
    };

    onPaginate (page) {
        console.log(this.state.passphrase);

        let reqParams = {
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1,
            includeHoldingInfo: true,
            ...this.state.passphrase,
        };

        this.setState(reqParams, () => {
            this.getAccountLedger(reqParams)
        });
    }

    async getAccountLedger(requestParams) {
        const ledger = await this.props.getAccountLedgerAction(requestParams);
        if (ledger) {
            this.setState({
                ...this.props,
                ledger: ledger.entries,
            });
        }
    }

    setLedgerEntryInfo(modalType, data) {
        this.getLedgerEntry({
            account: this.props.account,
            transaction: data
        });
    }

    async getLedgerEntry (modaltype, ledgerId, isPrivate) {
        const requestParams = {
            ledgerId: ledgerId
        };

        if (isPrivate) {
            const privateLedgerEntry = await this.props.getLedgerEntryAction({
                ...requestParams,
                passphrase: this.state.passphrase,
                account: this.props.account
            });

            if (privateLedgerEntry) {
                this.props.setBodyModalParamsAction('INFO_LEDGER_TRANSACTION', privateLedgerEntry)
            }

        } else {
            const ledgerEntry = await this.props.getLedgerEntryAction({
                ...requestParams
            });

            if (ledgerEntry) {
                this.props.setBodyModalParamsAction('INFO_LEDGER_TRANSACTION', ledgerEntry.ledgerId)
            }
        }
    }

    getTransaction  = async (modaltype, ledgerId, isPrivate) => {

        let requestParams = {
            transaction: ledgerId
        };

        if (isPrivate) {
            requestParams.passphrase = this.state.passphrase;
            requestParams.account    = this.props.account;

            const privateLedgerEntry = await this.props.getTransactionAction(requestParams);

            if (privateLedgerEntry) {
                this.props.setBodyModalParamsAction('INFO_TRANSACTION', privateLedgerEntry)
            }
        } else {
            const ledgerEntry = await this.props.getTransactionAction(requestParams);

            if (ledgerEntry) {
                this.props.setBodyModalParamsAction('INFO_TRANSACTION', ledgerEntry)
            }
        }
    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Account ledger'}
                    showPrivateTransactions={'ledger'}
                />
                <div className="page-body container-fluid">
                    <div className="account-ledger">
                        <div className="info-box info">
                            <p>Only ledger entries created during the last 30000 blocks are displayed.</p>
                        </div>

                        <ContentHendler
                            items={this.state.ledger}
                            emptyMessage={'No ledger found.'}
                        >
                            {
                                this.state.ledger &&
                                this.state.ledger.length > 0 &&
                                <div className="transaction-table">
                                    <div className="transaction-table-body">
                                        <table>
                                            <thead>
                                            <tr>
                                                <td>Date</td>
                                                <td>Type</td>
                                                <td className="align-right">Change</td>
                                                <td className="align-right">Balance</td>
                                                <td className="align-right">Holding</td>
                                                <td className="align-right">Change</td>
                                                <td className="align-right">Balance</td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.ledger.map((el, index) => {
                                                    return (
                                                        <Entry
                                                            key={uuid()}
                                                            entry={el}
                                                            publicKey= {this.state.serverPublicKey}
                                                            privateKey={this.state.privateKey}
                                                            sharedKey= {this.state.sharedKey}
                                                            setLedgerEntryInfo={this.getLedgerEntry}
                                                            setTransactionInfo={this.getTransaction}
                                                        />
                                                    );
                                                })
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="btn-box under-table">
                                        <a
                                            className={classNames({
                                                'btn' : true,
                                                'btn-left' : true,
                                                'disabled' : this.state.page <= 1
                                            })}
                                            onClick={this.onPaginate.bind(this, this.state.page - 1)}
                                        >
                                            Previous
                                        </a>
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
                                                'disabled' : this.state.ledger.length < 15
                                            })}
                                        >
                                            Next
                                        </a>
                                    </div>
                                </div>
                            }
                        </ContentHendler>
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
    getAccountLedgerAction: (requestParams) => dispatch(getAccountLedgerAction(requestParams)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
    setModalCallbackAction: (callback) => dispatch(setModalCallback(callback)),
    getLedgerEntryAction: (reqParams) => dispatch(getLedgerEntryAction(reqParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

export default connect(
    mapStateToProps,
    initMapDispatchToProps
)(Ledger);
