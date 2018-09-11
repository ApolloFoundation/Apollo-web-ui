import React from 'react';
import {connect} from 'react-redux';
import {setModalData, setBodyModalParamsAction} from '../../../modules/modals';
import Transaction from '../../account/transactions/transaction';
import classNames from 'classnames';
import uuid from "uuid";
import {getAccountAction} from "../../../actions/account";
import {getTransactionAction} from "../../../actions/transactions";
import {switchAccountAction} from "../../../actions/account";
import {getAccountInfoAction} from "../../../actions/account";
import Entry from '../../account/ledger/entry';

import QRCode from 'qrcode.react';


class AccountDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
        };

    }

    componentDidMount() {
        this.getAccountInfo();
    }


    handleTab = (e, index) => {
        e.preventDefault();

        this.setState({
            ...this.state,
            activeTab: index
        })
    };

    getAccountInfo = async () => {
        const account = await this.props.getAccountInfoAction({account: this.props.account});

        if (account) {
            this.setState({
                ...this.state,
                account: account
            })
        }
    };

    // requets

    // TODO: migrate timesamp, migrate account to RS

    render() {
        return (
            <div className="modal-box">
                {
                    this.state.account &&
                    <form className="modal-form">
                        <div className="form-group-app">
                            <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                            <div className="form-title inline">
                                <p>Account details</p>

                            </div>
                            <div className="form-tabulator active">
                                <div className="form-tab-nav-box justify-left">
                                    <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 0
                                    })}>
                                        <span className="pre">Account Details</span>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 1
                                    })}>
                                        <span className="pre">Account Leasing</span>
                                    </a>
                                    {/*<a onClick={(e) => this.handleTab(e, 2)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 2
                                    })}>
                                        <span className="pre">Account Control</span>
                                    </a>*/}

                                </div>

                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 0
                                })}>
                                    <div className="transaction-table no-min-height">
                                        <div className="transaction-table-body transparent">
                                            <table>
                                                <tbody className="with-padding">
                                                    <tr>
                                                        <td  className="no-brake">Account ID:</td>
                                                        <td className="blue-text">{this.state.account.accountRS}</td>
                                                    </tr>
                                                    <tr>
                                                        <td  className="no-brake">Numeric Account ID::</td>
                                                        <td>{this.state.account.account}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Balance::</td>
                                                        <td>{Math.round(this.state.account.balanceATM / 100000000)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Available Balance:</td>
                                                        <td>{Math.round(this.state.account.balanceATM / 100000000)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Guaranteed Balance:</td>
                                                        <td>{Math.round(this.state.account.guaranteedBalanceATM / 100000000)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Effective Balance:</td>
                                                        <td>{Math.round(this.state.account.effectiveBalanceAPL / 100000000)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Forged Balance:</td>
                                                        <td>{Math.round(this.state.account.forgedBalanceATM / 100000000)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Public Key:</td>
                                                        <td className="word-brake">{this.state.account.publicKey}</td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            className="no-brake"
                                                            style={{
                                                                paddingTop: 15,
                                                                verticalAlign: 'top'
                                                            }}
                                                        >
                                                            Account QR Code:
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingTop: 15,
                                                                paddingBottom: 15
                                                            }}
                                                        >
                                                            <QRCode value={this.state.account.accountRS} size={50}/></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Passphrase QR Code:</td>
                                                        <td>Passphrase Not Available</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Paper Wallet:</td>
                                                        <td><a className="btn primary">Print</a></td>
                                                    </tr>
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
                                            <p>Your account effective balance is not leased out.</p>
                                            <a
                                                onClick={() => this.props.setBodyModalParamsAction('LEASE_BALANCE')}
                                                data-blue-link-text
                                            >
                                                Lease your balance to another account.
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                {/*<div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 2
                                })}>
                                    <div className="transaction-table no-min-height">
                                        <div className="transaction-table-body transparent padding-vertical-padding">
                                            <a
                                                onClick={() => this.props.setBodyModalParamsAction('MANDATORY_APPROVAL')}
                                                data-blue-link-text
                                            >
                                                Setup Mandatory Approval.
                                            </a>
                                        </div>
                                    </div>
                                </div>*/}

                            </div>
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
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => setModalData(data),
    getTransactionAction: (data) => dispatch(getTransactionAction(data)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getAccountInfoAction: (account) => dispatch(getAccountInfoAction(account)),
    // getAccountData
    getAccountAction:  (requestParams) => dispatch(getAccountAction(requestParams)),
    switchAccountAction:  (requestParams) => dispatch(switchAccountAction(requestParams)),


});

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetails);
