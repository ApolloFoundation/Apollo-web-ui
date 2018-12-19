/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData, setBodyModalParamsAction} from '../../../modules/modals';
import Transaction from '../../account/transactions/transaction';
import classNames from 'classnames';
import {getAccountAction} from "../../../actions/account";
import {getTransactionAction} from "../../../actions/transactions";
import {switchAccountAction} from "../../../actions/account";
import {getAccountInfoAction} from "../../../actions/account";
import {withRouter} from 'react-router-dom';
import Entry from '../../account/ledger/entry';
import QR from 'qrcode';

import QRCode from 'qrcode.react';
import jsPDF from "jspdf";


class AccountDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            tinggi:11.69,
            lebar:'08.27',
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
        const account = await this.props.getAccountInfoAction({account: this.props.account, includeLessors: true, includeEffectiveBalance: true});

        if (account) {
            this.setState({
                ...this.state,
                account: account
            })
        }
    };

    // requets

    // TODO: migrate timesamp, migrate account to RS

    generatePDFStandard = (credentials) => {
        // e.preventDefault();

        let doc = new jsPDF({
            // orientation: 'landscape',
            unit: 'in',
            // format: [4, 2]  // tinggi, lebar
            format: [this.state.tinggi, this.state.lebar]
        });

        var qrcode;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();


        doc.setFontSize(15);
        doc.text('Apollo Paper Wallet', 0.5, 0.5);
        doc.setFontSize(10);

        doc.text(`${yyyy}/${mm}/${dd}`, 0.5, 0.8 + (0.3))
        doc.text(`${credentials[0].name}:`, 0.5, 0.8 + (0.3 * 2))
        doc.text(`${credentials[0].value}`, 0.5, 0.8 + (0.3 * 3))

        QR.toDataURL(credentials[0].value, function (err, url) {
            doc.addImage( url, 'SVG', 0.5, 1.9, 1.9, 1.9)
        })

        doc.save(`apollo-wallet-${credentials[0].value}`)
    };

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
                                    {<a onClick={(e) => this.handleTab(e, 2)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 2
                                    })}>
                                        <span className="pre">Account Control</span>
                                    </a>}

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
                                                        <td  className="no-brake">Numeric Account ID:</td>
                                                        <td>{this.state.account.account}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Balance::</td>
                                                        <td>{this.state.account.balanceATM ? (this.state.account.balanceATM / 100000000).toFixed(2) : '0'} Apollo</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Available Balance:</td>
                                                        <td>{this.state.account.unconfirmedBalanceATM ? (this.state.account.unconfirmedBalanceATM / 100000000).toFixed(2) : '0'} Apollo</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Guaranteed Balance:</td>
                                                        <td>{this.state.account.guaranteedBalanceATM ? (this.state.account.guaranteedBalanceATM / 100000000).toFixed(2) : '0'} Apollo</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Effective Balance:</td>
                                                        <td>{this.state.account.effectiveBalanceAPL ? (this.state.account.effectiveBalanceAPL).toFixed(2) : '0'} Apollo</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Forged Balance:</td>
                                                        <td>{this.state.account.forgedBalanceATM ? (this.state.account.forgedBalanceATM / 100000000).toFixed(2) : '0'} Apollo</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Public Key:</td>
                                                        <td className="word-brake">{this.state.account.publicKey ? this.state.account.publicKey : '-'}</td>
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
                                                        <td className="no-brake">Secret phrase QR Code:</td>
                                                        <td>Secret phrase Not Available</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="no-brake">Paper Wallet:</td>
                                                        <td>
                                                            <a className="btn primary hide-media"
                                                               onClick={() => this.generatePDFStandard([
                                                                   {name: 'Account ID', value: this.state.account.accountRS},
                                                               ])}
                                                            >
                                                                Print
                                                            </a>
                                                        </td>
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
                                {<div className={classNames({
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
                                </div>}

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
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    getAccountInfoAction: (account) => dispatch(getAccountInfoAction(account)),
    // getAccountData
    getAccountAction:  (requestParams) => dispatch(getAccountAction(requestParams)),
    switchAccountAction:  (requestParams, history) => dispatch(switchAccountAction(requestParams, history)),


});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountDetails));
