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
            publicKey:  this.state.publicKey,
            privateKey: this.state.privateKey,
            sharedKey:  this.state.sharedKey
        }, () => {
            this.getAccountLedger({
                PublicKey: this.state.publicKey,
                account: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex,
                includeHoldingInfo: true
            });
        });
    }

    getPrivateEntries = (data) => {
        let reqParams = {
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            includeHoldingInfo: true
        };

        if (data && data.publicKey) {

            this.setState({
                ...this.props,
                publicKey:  data.publicKey,
                privateKey: data.privateKey
            });

            reqParams.publicKey = data.publicKey;
        }
        if (data && data.PublicKey) {
            reqParams.publicKey = data.PublicKey;
        }

        this.getAccountLedger(reqParams);
    };

    onPaginate (page) {
        let reqParams = {
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1,
            includeHoldingInfo: true

        };

        if (this.state.publicKey) {
            reqParams.publicKey = this.state.publicKey
        }

        this.setState(reqParams, () => {
            this.getAccountLedger(reqParams)
        });
    }

    async getAccountLedger(requestParams) {

        if (requestParams.PublicKey) {
            requestParams.publicKey = requestParams.PublicKey;
            delete requestParams.PublicKey;
        }

        const ledger = await this.props.getAccountLedgerAction(requestParams);
        if (ledger) {
            if (ledger.serverPublicKey) {

                // const serverPublicKey = crypto.getSharedSecretJava(conv.hexStringToByteArray(transactions.serverPublicKey))
                const privateKey      = converters.hexStringToByteArray(this.state.privateKey);

                const sharedKey = converters.byteArrayToHexString(new Uint8Array(crypto.getSharedSecretJava(
                    privateKey,
                    converters.hexStringToByteArray(ledger.serverPublicKey)
                )));

                this.setState({
                    ...this.props,
                    ledger: ledger.entries,
                    serverPublicKey: ledger.serverPublicKey,
                    sharedKey : sharedKey
                });
            } else {
                this.setState({
                    ...this.props,
                    ledger: ledger.entries
                });
            }
        }
    }

    async getLedgerEntry (modaltype, ledgerId) {

        const requestParams = {
            ledgerId: ledgerId
        };

        const ledgerEntry = await this.props.getLedgerEntryAction(requestParams);

        if (ledgerEntry) {
            this.props.setBodyModalParamsAction('INFO_LEDGER_TRANSACTION', ledgerEntry)
        }
    }

    async getTransaction (modaltype, ledgerId) {

        const requestParams = {
            ledgerId: ledgerId
        };

        const ledgerEntry = await this.props.getLedgerEntryAction(requestParams);

        if (ledgerEntry) {
            this.props.setBodyModalParamsAction('INFO_LEDGER_TRANSACTION', ledgerEntry)
        }
    }

    setLedgerEntryInfo(modalType, data) {
        this.getLedgerEntry({
            account: this.props.account,
            transaction: data
        });
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
                        {
                            this.state.ledger &&
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
                                        <tbody key={uuid()}>
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
                            </div> ||
                            <div className={'loader-box'}>
                                <div className="ball-pulse">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        }

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
