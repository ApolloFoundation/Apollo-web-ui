/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData, setBodyModalParamsAction} from '../../../../modules/modals';
import {getAccountAction} from "../../../../actions/account";
import {getTransactionAction} from "../../../../actions/transactions";
import {switchAccountAction} from "../../../../actions/account";
import {getAccountInfoAction} from "../../../../actions/account";
import {withRouter} from 'react-router-dom';
import {getPhasingOnlyControl} from '../../../../actions/account/';

import QR from 'qrcode';

import QRCode from 'qrcode.react';
import jsPDF from "jspdf";

import {ONE_APL} from '../../../../constants';
import ContentLoader from '../../../components/content-loader'
import ModalBody from '../../../components/modals/modal-body';
import TabulationBody from '../../../components/tabulator/tabuator-body';
import TabContaier from '../../../components/tabulator/tab-container';

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

    getAccountInfo = async () => {
        const account = await this.props.getAccountInfoAction({account: this.props.account, includeLessors: true, includeEffectiveBalance: true});

        const phasingControl = await getPhasingOnlyControl({account: this.props.accountRS});

        if (account) {
            this.setState({
                ...this.state,
                account: account,
                phasingControl
            })
        }
    };

    // requets

    // TODO: migrate timesamp, migrate account to RS

    generatePDFStandard = (credentials) => {
        // e.preventDefault();

        let doc = new jsPDF();

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();


        doc.setFontSize(15);
        doc.text('Apollo Paper Wallet', 15, 15);
        doc.setFontSize(10);
        doc.text(`${yyyy}/${mm}/${dd}`, 15, 30);
        doc.text(`${credentials[0].name}:`, 15, 36);
        doc.text(`${credentials[0].value}`, 15, 42);

        QR.toDataURL(credentials[0].value, function (err, url) {
            doc.addImage( url, 'SVG', 15, 48, 48, 48)
        });

        doc.save(`apollo-wallet-${credentials[0].value}`)
    };

    formatControlType = (type) => {
        switch (type) {
            case 0: return 'Control by account';
            case 1: return 'Control by account balance';
            case 2: return 'Control by asset balance';
            case 3: return 'Control by currency balance';
            default: return null;
        }
    };

    render() {
        const {phasingControl} = this.state;

        const isAccountControl = phasingControl && Object.values(phasingControl).length;

        const votingModel = isAccountControl ? this.formatControlType(phasingControl.votingModel) : null

        return (
            <ModalBody
                modalTitle={'Account details'}
                closeModal={this.props.closeModal}
                isDisableFormFooter
                isDisableSecretPhrase
            >
                <TabulationBody>
                    <TabContaier sectionName={'Account Details'}>
                        {
                            this.state.account ?
                            <div className="transaction-table no-min-height transparent">
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
                                                <td className="no-brake">Balance:</td>
                                                <td>{this.state.account.balanceATM ? (this.state.account.balanceATM / ONE_APL).toFixed(2) : '0'} APL</td>
                                            </tr>
                                            <tr>
                                                <td className="no-brake">Available Balance:</td>
                                                <td>{this.state.account.unconfirmedBalanceATM ? (this.state.account.unconfirmedBalanceATM / ONE_APL).toFixed(2) : '0'} APL</td>
                                            </tr>
                                            <tr>
                                                <td className="no-brake">Guaranteed Balance:</td>
                                                <td>{this.state.account.guaranteedBalanceATM ? (this.state.account.guaranteedBalanceATM / ONE_APL).toFixed(2) : '0'} APL</td>
                                            </tr>
                                            <tr>
                                                <td className="no-brake">Effective Balance:</td>
                                                <td>{this.state.account.effectiveBalanceAPL ? (this.state.account.effectiveBalanceAPL).toFixed(2) : '0'} APL</td>
                                            </tr>
                                            <tr>
                                                <td className="no-brake">Forged Balance:</td>
                                                <td>{this.state.account.forgedBalanceATM ? (this.state.account.forgedBalanceATM / ONE_APL).toFixed(2) : '0'} APL</td>
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
                                                    <a className="btn btn-default"
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
                            </div> : <ContentLoader />
                        }

                    </TabContaier>
                </TabulationBody>
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.account,
    accountRS: state.account.accountRS
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
