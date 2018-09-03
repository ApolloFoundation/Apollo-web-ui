import React from 'react';
import {connect} from 'react-redux';
import {setModalData, setBodyModalParamsAction} from '../../../modules/modals';
import Transaction from '../../account/transactions/transaction';
import classNames from 'classnames';
import uuid from "uuid";
import {getAccountAction} from "../../../actions/account";
import {getTransactionAction} from "../../../actions/transactions";
import {switchAccountAction} from "../../../actions/account";
import Entry from '../../account/ledger/entry';


class InfoAccount extends React.Component {
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

        this.handleTab      = this.handleTab.bind(this);
        // this.getTransaction = this.getTransaction.bind(this);
        this.getAcccount    = this.getAcccount.bind(this);
    }

    handleTab(e, index) {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
    }

    componentDidMount() {
        this.getAcccount({
            account:    this.props.modalData,
            firstIndex: 0,
            lastIndex:  99
        })
    }

    componentWillReceiveProps() {
        this.getAcccount({
            account:    this.props.modalData,
            firstIndex: 0,
            lastIndex:  99
        })
    }

    // requets
    async getAcccount (requestParams){
        if (this.props.modalData) {
            const accountData = this.props.getAccountAction(requestParams);

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
            });
        }
    }

    async getTransaction (requestParams) {
        const transaction = await this.props.getTransactionAction(requestParams);

        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction)
        }
    }

    setTransactionInfo(modalType, data) {
        this.getTransaction({
            account: this.props.account,
            transaction: data
        });
    }

    // TODO: migrate timesamp, migrate account to RS

    render() {
        return (
            <div className="modal-box x-wide">
                {
                    this.props.modalData &&
                    <form className="modal-form">
                        <div className="form-group">
                            <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                            <div className="form-title inline">
                                {
                                    this.state.account &&

                                    [
                                        <p>Info {this.state.account.accountRS} Account</p>
                                    ,
                                        this.props.modalData !== this.props.account &&
                                        <a
                                           onClick={() => this.props.switchAccountAction(this.state.account.accountRS)}
                                            className="btn primary static"
                                           style={{
                                               margin: '0 0 0 30px'
                                           }}
                                        >
                                            Switch Account
                                        </a>
                                    ]
                                }

                            </div>

                            <div className="form-tabulator active">
                                <div className="form-tab-nav-box justify-left">
                                    <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 0
                                    })}>
                                        <span className="pre">Transactions</span>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 1
                                    })}>
                                        <span className="pre">Ledger</span>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 2)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 2
                                    })}>
                                        <span className="pre">Assets</span>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 2)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 2
                                    })}>
                                        <span className="pre">Trade history</span>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 2)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 2
                                    })}>
                                        <span className="pre">Currencies</span>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 2)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 2
                                    })}>
                                        <span className="pre">Marketplace</span>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 2)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 2
                                    })}>
                                        <span className="pre">Aliases</span>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 2)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 2
                                    })}>
                                        <span className="pre">Actions</span>
                                    </a>

                                </div>

                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 0
                                })}>
                                    <div className="transaction-table no-min-height">
                                        <div className="transaction-table-body transparent padding-vertical-padding">
                                            <table>
                                                <thead key={uuid()}>
                                                <tr>
                                                    <td>Index</td>
                                                    <td>Date</td>
                                                    <td>Type</td>
                                                    <td className="align-right">Amount</td>
                                                    <td className="align-right">Fee</td>
                                                    <td>From</td>
                                                    <td>To</td>
                                                </tr>
                                                </thead>
                                                <tbody key={uuid()}>
                                                {
                                                    this.state.transactions &&
                                                    this.state.transactions.transactions.map((el, index) => {

                                                        return (
                                                            <Transaction
                                                                block
                                                                transaction = {el}
                                                                index={index}
                                                                setTransactionInfo={this.getTransaction}
                                                            />
                                                        )
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 1
                                })}>
                                    <div className="transaction-table no-min-height">
                                        <div className="transaction-table-body transparent padding-vertical-padding">
                                            <table>
                                                <thead>
                                                <tr>
                                                    <td>Entry</td>
                                                    <td>Type</td>
                                                    <td className="align-right">Change</td>
                                                    <td>Balance</td>
                                                    <td>Holding</td>
                                                    <td className="align-right">Change</td>
                                                    <td className="align-right">Balance</td>
                                                </tr>
                                                </thead>
                                                <tbody key={uuid()}>
                                                {
                                                    this.state.account_ledger &&
                                                    this.state.account_ledger.entries.map((el, index) => {
                                                        return (
                                                            <Entry
                                                                entry={el}
                                                                publicKey= {this.state.serverPublicKey}
                                                                privateKey={this.state.privateKey}
                                                                sharedKey= {this.state.sharedKey}
                                                                setLedgerEntryInfo={this.getLedgerEntry}
                                                            />
                                                        );
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 2
                                })}>
                                    <div className="transaction-table no-min-height">
                                        <div className="transaction-table-body transparent">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>Previous Block Hash:</td>
                                                        <td className="word-brake">{this.props.modalData.previousBlockHash}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Payload Length:</td>
                                                        <td className="word-brake">{this.props.modalData.payloadLength}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Fee ATM:</td>
                                                        <td className="word-brake">{this.props.modalData.totalFeeATM / 100000000}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Generation Signature:</td>
                                                        <td className="word-brake">{this.props.modalData.generationSignature}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Executed Phased Transactions:</td>
                                                        <td className="word-brake">{this.props.modalData.fullHash}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Generator Public Key:</td>
                                                        <td className="word-brake">{this.props.modalData.generatorPublicKey}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Base Target:</td>
                                                        <td className="word-brake">{this.props.modalData.baseTarget}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Payload Hash:</td>
                                                        <td className="word-brake">{this.props.modalData.payloadHash}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Number of Transactions:</td>
                                                        <td className="word-brake">{this.props.modalData.numberOfTransactions}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Block Signature:</td>
                                                        <td className="word-brake">{this.props.modalData.blockSignature}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Version:</td>
                                                        <td className="word-brake">{this.props.modalData.version}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Amount ATM:</td>
                                                        <td className="word-brake">{this.props.modalData.totalFeeATM / 100000000}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Cumulative Difficulty:</td>
                                                        <td className="word-brake">{this.props.modalData.cumulativeDifficulty}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Block:</td>
                                                        <td className="word-brake">{this.props.modalData.block}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Height:</td>
                                                        <td className="word-brake">{this.props.modalData.height}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Timestamp:</td>
                                                        <td className="word-brake">{this.props.modalData.timesamp}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Generator:</td>
                                                        <td className="word-brake">{this.props.modalData.generator}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Previous Block:</td>
                                                        <td className="word-brake">{this.props.modalData.previousBlock}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 3
                                })}>
                                    <div className="transaction-table no-min-height">
                                        <div className="transaction-table-body transparent">
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <td>Previous Block Hash:</td>
                                                    <td className="word-brake">{this.props.modalData.previousBlockHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Payload Length:</td>
                                                    <td className="word-brake">{this.props.modalData.payloadLength}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Fee ATM:</td>
                                                    <td className="word-brake">{this.props.modalData.totalFeeATM / 100000000}</td>
                                                </tr>
                                                <tr>
                                                    <td>Generation Signature:</td>
                                                    <td className="word-brake">{this.props.modalData.generationSignature}</td>
                                                </tr>
                                                <tr>
                                                    <td>Executed Phased Transactions:</td>
                                                    <td className="word-brake">{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Generator Public Key:</td>
                                                    <td className="word-brake">{this.props.modalData.generatorPublicKey}</td>
                                                </tr>
                                                <tr>
                                                    <td>Base Target:</td>
                                                    <td className="word-brake">{this.props.modalData.baseTarget}</td>
                                                </tr>
                                                <tr>
                                                    <td>Payload Hash:</td>
                                                    <td className="word-brake">{this.props.modalData.payloadHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Number of Transactions:</td>
                                                    <td className="word-brake">{this.props.modalData.numberOfTransactions}</td>
                                                </tr>
                                                <tr>
                                                    <td>Block Signature:</td>
                                                    <td className="word-brake">{this.props.modalData.blockSignature}</td>
                                                </tr>
                                                <tr>
                                                    <td>Version:</td>
                                                    <td className="word-brake">{this.props.modalData.version}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Amount ATM:</td>
                                                    <td className="word-brake">{this.props.modalData.totalFeeATM / 100000000}</td>
                                                </tr>
                                                <tr>
                                                    <td>Cumulative Difficulty:</td>
                                                    <td className="word-brake">{this.props.modalData.cumulativeDifficulty}</td>
                                                </tr>
                                                <tr>
                                                    <td>Block:</td>
                                                    <td className="word-brake">{this.props.modalData.block}</td>
                                                </tr>
                                                <tr>
                                                    <td>Height:</td>
                                                    <td className="word-brake">{this.props.modalData.height}</td>
                                                </tr>
                                                <tr>
                                                    <td>Timestamp:</td>
                                                    <td className="word-brake">{this.props.modalData.timesamp}</td>
                                                </tr>
                                                <tr>
                                                    <td>Generator:</td>
                                                    <td className="word-brake">{this.props.modalData.generator}</td>
                                                </tr>
                                                <tr>
                                                    <td>Previous Block:</td>
                                                    <td className="word-brake">{this.props.modalData.previousBlock}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-right">Enter</button>

                    </form>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => setModalData(data),
    getTransactionAction: (data) => dispatch(getTransactionAction(data)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),

    // getAccountData
    getAccountAction:  (requestParams) => dispatch(getAccountAction(requestParams)),
    switchAccountAction:  (requestParams) => dispatch(switchAccountAction(requestParams)),


});

export default connect(mapStateToProps, mapDispatchToProps)(InfoAccount);
