/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData, setBodyModalParamsAction, openPrevModal} from '../../../../modules/modals';
import classNames from 'classnames';

import {getAccountAction}     from "../../../../actions/account";
import {getTransactionAction} from "../../../../actions/transactions";
import {getLedgerEntryAction} from "../../../../actions/ledger";
import {switchAccountAction}  from "../../../../actions/account";
import {formatTimestamp}      from '../../../../helpers/util/time';
import {withRouter}     from "react-router-dom";

import ModalTransaction from '../../../account/modalTransactions/transaction';
import Asset from '../../../account/my-assets/my-asset-item';
import {getBlockAction} from "../../../../actions/blocks";

import CustomTable from '../../../components/tables/table';
import TabulationBody from '../../../components/tabulator/tabuator-body';
import TabContaier from '../../../components/tabulator/tab-container';

import Entry from './ledger-entry';
import Trade from './trade';
import Currency from './currency';
import Alias from './alias';

class InfoAccount extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            transactions: null,
            account_ledger: null,
            assets: null,
            trades: null,
            currencies: null,
            goods: null,
            aliases: null,
            account: null,
        };

        this.handleTab   = this.handleTab.bind(this);
        this.getAcccount = this.getAcccount.bind(this);
    }

    handleTab(e, index) {
        e.preventDefault();

        this.setState({
            ...this.props,
            ...this.state,
            activeTab: index
        })
    }

    componentDidMount() {
        if (this.props.modalData) {
            this.getAcccount({
                account:    this.props.modalData,
                firstIndex: 0,
                lastIndex:  99
            })
        }
    }

    componentWillReceiveProps(newState) {
        if (newState.modalData) {
            this.getAcccount({
                account:    newState.modalData,
                firstIndex: 0,
                lastIndex:  99
            })
        }
    }

    // requets
    getAcccount = async (requestParams) => {
        const accountData = this.props.getAccountAction(requestParams);

        if (accountData) {
            this.setState({
                ...this.props,
                transactions:   await accountData['TRANSACTIONS'],
                account_ledger: await accountData['ACCOUNT_LEDGER'],
                assets:         await accountData['ASSETS'],
                trades:         await accountData['TRADES'],
                currencies:     await accountData['CURRENCIES'],
                goods:          await accountData['GOODS'],
                aliases:        await accountData['ALIASES'],
                account:        await accountData['ACCOUNT'],
            }, () => {
                if (this.state.assets) {

                    const accountAssets = this.state.assets.accountAssets;
                    const assetsInfo    = this.state.assets.assets;

                    const resultAsset = accountAssets.map((el, index) => {
                        return {...(assetsInfo[index]), ...el}
                    });

                    this.setState({
                        assets: resultAsset
                    })
                }
            });
        }

    };

    getTransaction = async (requestParams) => {
        const transaction = await this.props.getTransactionAction(requestParams);

        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction)
        }
    };

    setTransactionInfo = (modalType, data) => {
        this.getTransaction({
            transaction: data,
        });
    }

    getLedgerEntry = async (modaltype, ledgerId, isPrivate) => {

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
                this.props.setBodyModalParamsAction('INFO_LEDGER_TRANSACTION', requestParams.ledgerId)
            }
        }
    }

    setLedgerEntryInfo = (modalType, data) => {
        this.getLedgerEntry({
            account: this.props.account,
            transaction: data
        });
    }

    render() {
        return (
            <div className="modal-box x-wide">
                {
                    this.props.modalData &&
                    <form className="modal-form">
                        <div className="form-group-app media-tab">
                            <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                            <div className="form-title inline">
	                            {this.props.modalsHistory.length > 1 &&
	                            <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
	                            }
                                {
                                    this.state.account &&
                                    <React.Fragment>
                                        <p>Account {this.state.account.accountRS} info</p>
                                        {
                                            this.props.account !== this.state.account.account &&
                                            <a
                                                onClick={() => this.props.switchAccountAction(this.state.account.accountRS, this.props.history)}
                                                className="btn primary static"
                                                style={{
                                                    margin: '0 0 0 30px'
                                                }}
                                            >
                                                Switch Account
                                            </a>
                                        }
                                    </React.Fragment>
                                }
	                            {
		                            this.state.account &&
		                            <div className={"account-balance-text"}>Account has a balance
			                            of <strong>{Math.round(this.state.account.unconfirmedBalanceATM / Math.pow(10, 8))} Apollo</strong></div>
	                            }

                            </div>

                            <TabulationBody>
                                <TabContaier sectionName="Transactions">
                                    <CustomTable 
                                        header={[
                                            {
                                                name: 'Date',
                                                alignRight: false
                                            },{
                                                name: 'Type',
                                                alignRight: false
                                            },{
                                                name: 'Amount',
                                                alignRight: true
                                            },{
                                                name: 'Fee',
                                                alignRight: false
                                            },{
                                                name: 'From',
                                                alignRight: false
                                            },{
                                                name: 'To',
                                                alignRight: false
                                            },{
                                                name: 'Height',
                                                alignRight: false
                                            }
                                        ]}
                                        className={'no-min-height transparent pt-4'}
                                        emptyMessage={'No active polls.'}
                                        TableRowComponent={ModalTransaction}
                                        tableData={this.state.transactions ? this.state.transactions.transactions : null}
                                    />  
                                </TabContaier>
                                <TabContaier sectionName="Ledger">
                                    <CustomTable 
                                        header={[
                                            {
                                                name: 'Entry',
                                                alignRight: false
                                            },{
                                                name: 'Type',
                                                alignRight: false
                                            },{
                                                name: 'Change',
                                                alignRight: true
                                            },{
                                                name: 'Balance',
                                                alignRight: false
                                            },{
                                                name: 'Holding',
                                                alignRight: false
                                            },{
                                                name: 'Change',
                                                alignRight: true
                                            },{
                                                name: 'Balance',
                                                alignRight: true
                                            }
                                        ]}
                                        className={'no-min-height transparent pt-4'}
                                        emptyMessage={'No active polls.'}
                                        TableRowComponent={Entry}
                                        tableData={this.state.account_ledger ? this.state.account_ledger.entries : null }
                                    />
                                </TabContaier>
                                <TabContaier sectionName="Assets">
                                    <CustomTable 
                                        header={[
                                            {
                                                name: 'Asset',
                                                alignRight: false
                                            },{
                                                name: 'Quantity',
                                                alignRight: false
                                            },{
                                                name: 'Total Available',
                                                alignRight: true
                                            },{
                                                name: 'Percentage',
                                                alignRight: false
                                            }
                                        ]}
                                        className={'no-min-height transparent pt-4'}
                                        emptyMessage={'No active polls.'}
                                        TableRowComponent={Asset}
                                        hintClassName={'simple no-padding-on-the-sides'}
                                        tableData={this.state.assets}
                                    />
                                </TabContaier>
                                <TabContaier sectionName="Trade history">
                                    <CustomTable 
                                        header={[
                                            {
                                                name: 'Asset',
                                                alignRight: false
                                            },{
                                                name: 'Date',
                                                alignRight: false
                                            },{
                                                name: 'Type',
                                                alignRight: false
                                            },{
                                                name: 'Quantity',
                                                alignRight: true
                                            },{
                                                name: 'Price',
                                                alignRight: true
                                            },{
                                                name: 'Total',
                                                alignRight: true
                                            }
                                        ]}
                                        className={'no-min-height transparent pt-4'}
                                        emptyMessage={'This account do not have any trades.'}
                                        TableRowComponent={Trade}
                                        hintClassName={'simple no-padding-on-the-sides'}
                                        tableData={this.state.trades ? this.state.trades.trades : null}
                                    />
                                </TabContaier>
                                <TabContaier sectionName="Currencies">
                                    <CustomTable 
                                        header={[
                                            {
                                                name: 'Code',
                                                alignRight: false
                                            },{
                                                name: 'Name',
                                                alignRight: false
                                            },{
                                                name: 'Units',
                                                alignRight: true
                                            },
                                        ]}
                                        className={'no-min-height transparent pt-4'}
                                        emptyMessage={'This user has no currencies.'}
                                        TableRowComponent={Currency}
                                        hintClassName={'simple no-padding-on-the-sides'}
                                        tableData={this.state.currencies ? this.state.currencies.accountCurrencies : null}
                                    />
                                </TabContaier>
                                <TabContaier sectionName="Marketplace">
                                    <CustomTable 
                                        header={[
                                            {
                                                name: 'Item',
                                                alignRight: false
                                            },{
                                                name: 'Price',
                                                alignRight: true
                                            },{
                                                name: 'QTY',
                                                alignRight: true
                                            },
                                        ]}
                                        className={'no-min-height transparent pt-4'}
                                        emptyMessage={'This user has no goods.'}
                                        TableRowComponent={Currency}
                                        hintClassName={'simple no-padding-on-the-sides'}
                                        tableData={this.state.goods ? this.state.goods.goods : null}
                                    />
                                    
                                </TabContaier>
                                <TabContaier sectionName="Aliases">
                                    <CustomTable 
                                        header={[
                                            {
                                                name: 'Alias',
                                                alignRight: false
                                            },{
                                                name: 'URI',
                                                alignRight: true
                                            },
                                        ]}
                                        className={'no-min-height transparent pt-4'}
                                        emptyMessage={'This user has no aliases.'}
                                        TableRowComponent={Alias}
                                        hintClassName={'simple no-padding-on-the-sides'}
                                        tableData={this.state.aliases ? this.state.aliases.aliases : null}
                                    />
                                </TabContaier>
                                <TabContaier sectionName="Actions">
                                    <div className="flexible-grid">
                                        <a
                                            onClick={() => this.props.setBodyModalParamsAction('SEND_APOLLO', {}, {recipient: this.state.account.accountRS})}
                                            className={classNames({
                                                "btn": true,
                                                "btn-primary": true,
                                                "blue": true,
                                                "static" : true,
                                                "disabled": !this.state.account
                                            })}
                                        >
                                            Send Apollo
                                        </a>
	                                    <a
		                                    onClick={() => this.props.setBodyModalParamsAction('TRANSFER_CURRENCY', {}, {recipient: this.state.account.accountRS})}
		                                    className={classNames({
			                                    "btn": true,
			                                    "btn-primary": true,
			                                    "blue": true,
			                                    "static" : true,
			                                    "disabled": !this.state.account
		                                    })}
	                                    >
		                                    Send currency
	                                    </a>
                                        <a
                                            onClick={() => this.props.setBodyModalParamsAction('COMPOSE_MESSAGE', {}, {recipient: this.state.account.accountRS})}
                                            className={classNames({
                                                "btn": true,
                                                "btn-primary": true,
                                                "blue": true,
                                                "static" : true,
                                                "disabled": !this.state.account
                                            })}
                                        >
                                            Send a message
                                        </a>
                                        <a
                                            onClick={() => this.props.setBodyModalParamsAction('SAVE_ACCOUNT', {}, {recipient: this.state.account.accountRS})}
                                            className={classNames({
                                                "btn": true,
                                                "btn-primary": true,
                                                "blue": true,
                                                "static" : true,
                                                "disabled": !this.state.account
                                            })}
                                        >
                                            Add as contact
                                        </a>
                                    </div>
                                </TabContaier>                     
                            </TabulationBody>

                            <div className="btn-box align-buttons-inside absolute right-conner">
                                <a className="btn btn-right round round-top-left round-bottom-right"
                                   onClick={() => this.props.closeModal()}
                                >
                                    Close
                                </a>
                            </div>
                        </div>
                    </form>
                }
            </div>
        );
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

}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
	modalsHistory: state.modals.modalsHistory,
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => setModalData(data),
    getLedgerEntryAction: (data) => getLedgerEntryAction(data),
    getTransactionAction: (data) => dispatch(getTransactionAction(data)),
	setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
	openPrevModal: () => dispatch(openPrevModal()),

	// getAccountData
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
	getAccountAction:  (requestParams) => dispatch(getAccountAction(requestParams)),
	switchAccountAction:  (requestParams, history) => dispatch(switchAccountAction(requestParams, history)),


});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InfoAccount));
