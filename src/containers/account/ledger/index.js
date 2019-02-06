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
import {getBlockAction} from "../../../actions/blocks";
import { getAccountLedgerAction, getLedgerEntryAction } from "../../../actions/ledger";
import {setModalCallback, setBodyModalParamsAction, setModalType} from "../../../modules/modals";
import {getTransactionAction} from "../../../actions/transactions/";
import curve25519 from "../../../helpers/crypto/curve25519";
import converters from "../../../helpers/converters";
import crypto from "../../../helpers/crypto/crypto";
import {BlockUpdater} from "../../block-subscriber";
import ContentLoader from '../../components/content-loader'
import InfoBox from '../../components/info-box';
import ContentHendler from '../../components/content-hendler'
import {NotificationManager} from "react-notifications";

import CustomTable from '../../components/tables/table';

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
            ...this.state.passphrase,
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
                ...this.state.passphrase,
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
            includeHoldingInfo: true,
            ...data
        };

        if (data) {

            this.setState({
                passphrase:  data,
            });
        }

        this.getAccountLedger(reqParams);
    };

    onPaginate (page) {

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

    getAccountLedger = async (requestParams) => {
        const ledger = await this.props.getAccountLedgerAction(requestParams);
        if (ledger) {
            if (ledger.errorCode) {
                if (!this.state.isError) {
                    NotificationManager.error(ledger.errorDescription, 'Error', 900000);
                }
                this.setState({
                    isError: true
                });
            } else {
                if (!this.state.isPrivate && !!ledger.serverPublicKey) {
                    this.setState({
                        isPrivate: true
                    }, () => {
                        NotificationManager.success('You are watching private entries.', null, 900000);
                    })
                }
                this.setState({
                    ...this.props,
                    ledger: ledger.entries,
                    isError: false
                });
            }
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
            const ledgerEntry = await this.props.getLedgerEntryAction(requestParams);

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

    getBlock = async (type, blockHeight) => {
		const requestParams = {
			height: blockHeight
		};

		const block = await this.props.getBlockAction(requestParams);

		if (block) {
			this.props.setBodyModalParamsAction('INFO_BLOCK', block)
		}
	}

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Account ledger'}
                >

                    <a
                        className={classNames({
                            'btn': true,
                            'primary': true,
                            'disabled' : this.state.isPrivate
                        })}
                        onClick={() => {
                            this.props.setModalType('PrivateTransactions')

                        }}
                    >
                        Show private transactions
                    </a>

                </SiteHeader>
                
                <div className="page-body container-fluid">
                   
                    <CustomTable 
                        header={[
                            {
                                name: 'Date',
                                alignRight: false
                            },{
                                name: 'Type',
                                alignRight: false
                            },{
                                name: 'Change',
                                alignRight: true
                            },{
                                name: 'Balance',
                                alignRight: true
                            },{
                                name: 'Holding',
                                alignRight: true
                            },{
                                name: 'Change',
                                alignRight: true
                            },{
                                name: 'Balance',
                                alignRight: true
                            }
                        ]}
                        keyField={'ledgerId'}
                        className={'no-min-height'}
                        emptyMessage={'No active polls.'}
                        TableRowComponent={Entry}
                        tableData={this.state.ledger}
                        isPaginate
                        page={this.state.page}
                        previousHendler={() => this.onPaginate(this.state.page - 1)}
                        nextHendler={() => this.onPaginate(this.state.page + 1)}
                    />
                    {/* 
                    onClick={this.onPaginate.bind(this, this.state.page + 1)}
                    <Entry
                        key={uuid()}
                        entry={el}
                        publicKey= {this.state.serverPublicKey}
                        privateKey={this.state.privateKey}
                        sharedKey= {this.state.sharedKey}
                        setLedgerEntryInfo={this.getLedgerEntry}
                        setTransactionInfo={this.getTransaction}
                        setBlockInfo={this.getBlock}
                    /> */}
                </div>
            
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,
    publicKey : state.account.publicKey,

    // modals
    modalData: state.modals.modalData
});

const initMapDispatchToProps = dispatch => ({
    setModalType: (prevent) => dispatch(setModalType(prevent)),
	getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
    getAccountLedgerAction: (requestParams) => dispatch(getAccountLedgerAction(requestParams)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
    setModalCallbackAction: (callback) => dispatch(setModalCallback(callback)),
    getLedgerEntryAction: (reqParams) => dispatch(getLedgerEntryAction(reqParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(
    mapStateToProps,
    initMapDispatchToProps
)(Ledger);
