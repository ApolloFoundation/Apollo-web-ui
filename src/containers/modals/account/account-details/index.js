/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { processAccountIDtoRS } from 'apl-web-crypto';
import QR from 'qrcode';
import QRCode from 'qrcode.react';
import jsPDF from 'jspdf';
import { getAccountInfoAction, getPhasingOnlyControl } from 'actions/account';
import { setBodyModalParamsAction } from 'modules/modals';
import ContentLoader from 'containers/components/content-loader';
import Button from 'containers/components/button';
import ModalBody from 'containers/components/modals/modal-body';
import TabulationBody from 'containers/components/tabulator/tabuator-body';
import TabContaier from 'containers/components/tabulator/tab-container';
import {
  getAccountRsSelector,
  getAccountSelector,
  getActualBlockSelector,
  getCurrentLeasingHeightFromSelector,
  getCurrentLeasingHeightToSelector,
  getCurrentLesseeSelector,
  getDecimalsSelector,
  getModalDataSelector,
  getTickerSelector
} from 'selectors';
import './styles.scss';
import { bigIntDivision, bigIntFormat, bigIntFormatLength } from 'helpers/util/bigNumberWrappers';

class AccountDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
      tinggi: 11.69,
      lebar: '08.27',
    };
  }

  componentDidMount() {
    this.getAccountInfo();
  }

    getAccountInfo = async () => {
      const account = await this.props.getAccountInfoAction({
        account: this.props.account, includeLessors: true, includeEffectiveBalance: true,
      });

      const phasingControl = await getPhasingOnlyControl({ account: this.props.accountRS });

      if (account) {
        this.setState({
          ...this.state,
          account,
          phasingControl,
        });
      }
    };

    // requets

    // TODO: migrate timesamp, migrate account to RS

    generatePDFStandard = credentials => {
      // e.preventDefault();

      const doc = new jsPDF();

      const today = new Date();
      const dd = today.getDate();
      const mm = today.getMonth() + 1; // January is 0!
      const yyyy = today.getFullYear();

      doc.setFontSize(15);
      doc.text('Apollo Paper Wallet', 15, 15);
      doc.setFontSize(10);
      doc.text(`${yyyy}/${mm}/${dd}`, 15, 30);
      doc.text(`${credentials[0].name}:`, 15, 36);
      doc.text(`${credentials[0].value}`, 15, 42);

      QR.toDataURL(credentials[0].value, (err, url) => {
        doc.addImage(url, 'SVG', 15, 48, 48, 48);
      });

      doc.save(`apollo-wallet-${credentials[0].value}`);
    };

    formatControlType = type => {
      switch (type) {
        case 0: return 'Control by account';
        case 1: return 'Control by account balance';
        case 2: return 'Control by asset balance';
        case 3: return 'Control by currency balance';
        default: return null;
      }
    };

    render() {
      const { phasingControl } = this.state;
      const {
        ticker, decimals, currentLeasingHeightFrom,
        currentLeasingHeightTo, actualBlock, currentLessee,
      } = this.props;
      const isAccountControl = phasingControl && Object.values(phasingControl).length;
      const remainingBlocks = currentLeasingHeightTo - currentLeasingHeightFrom;
      const votingModel = isAccountControl ? this.formatControlType(phasingControl.votingModel) : null;
      return (
        <ModalBody
          modalTitle="Account details"
          closeModal={this.props.closeModal}
          isDisableFormFooter
          isDisableSecretPhrase
        >
          <TabulationBody>
            <TabContaier sectionName="Account Details">
              {
                this.state.account
                  ? (
                    <div className="transaction-table no-min-height transparent">
                      <div className="transaction-table-body transparent">
                        <table>
                          <tbody className="with-padding">
                            <tr>
                              <td className="no-brake">Account ID:</td>
                              <td className="blue-text">{this.state.account.accountRS}</td>
                            </tr>
                            <tr>
                              <td className="no-brake">Numeric Account ID:</td>
                              <td>{this.state.account.account}</td>
                            </tr>
                            <tr>
                              <td className="no-brake">Balance:</td>
                              <td>
                                {this.state.account.balanceATM ? bigIntFormatLength(bigIntDivision(this.state.account.balanceATM, decimals), 2) : '0'}
                                {' '}
                                {ticker}
                              </td>
                            </tr>
                            <tr>
                              <td className="no-brake">Available Balance:</td>
                              <td>
                                {this.state.account.unconfirmedBalanceATM 
                                  ? bigIntFormatLength(bigIntDivision(this.state.account.unconfirmedBalanceATM, decimals), 2) : '0'}
                                {' '}
                                {ticker}
                              </td>
                            </tr>
                            <tr>
                              <td className="no-brake">Guaranteed Balance:</td>
                              <td>
                                {this.state.account.guaranteedBalanceATM
                                  ? bigIntFormatLength(bigIntDivision(this.state.account.guaranteedBalanceATM, decimals), 2) : '0'}
                                {' '}
                                {ticker}
                              </td>
                            </tr>
                            <tr>
                              <td className="no-brake">Effective Balance:</td>
                              <td>
                                {this.state.account.effectiveBalanceAPL ? (this.state.account.effectiveBalanceAPL).toFixed(2) : '0'}
                                {' '}
                                {ticker}
                              </td>
                            </tr>
                            <tr>
                              <td className="no-brake">Forged Balance:</td>
                              <td>
                                {this.state.account.forgedBalanceATM ? bigIntFormatLength(bigIntDivision(this.state.account.forgedBalanceATM, decimals), 2) : '0'}
                                {' '}
                                {ticker}
                              </td>
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
                                  verticalAlign: 'top',
                                }}
                              >
                                Account QR Code:
                              </td>
                              <td
                                style={{
                                  paddingTop: 15,
                                  paddingBottom: 15,
                                }}
                              >
                                <QRCode value={this.state.account.accountRS} size={50} />
                              </td>
                            </tr>
                            <tr>
                              <td className="no-brake">Secret phrase QR Code:</td>
                              <td>Secret phrase Not Available</td>
                            </tr>
                            <tr>
                              <td className="no-brake">Paper Wallet:</td>
                              <td>
                                <a
                                  className="btn btn-default"
                                  onClick={() => this.generatePDFStandard([
                                    { name: 'Account ID', value: this.state.account.accountRS },
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
                  ) : <ContentLoader />
              }
            </TabContaier>
            <TabContaier sectionName="Account Leasing">
              <div className="transaction-table no-min-height">
                <div className="transaction-table-body">
                  {currentLessee
                    ? (
                      <table>
                        <tbody className="with-padding">
                          <tr>
                            <td className="no-brake">Account Leasing:</td>
                            <td>{processAccountIDtoRS(currentLessee)}</td>
                          </tr>
                          <tr>
                            <td className="no-brake">Leasing is active from:</td>
                            <td>{currentLeasingHeightFrom}</td>
                          </tr>
                          <tr>
                            <td className="no-brake">Leasing is active to:</td>
                            <td>{currentLeasingHeightTo}</td>
                          </tr>
                          <tr>
                            <td className="no-brake">Remaining Blocks:</td>
                            <td>{remainingBlocks}</td>
                          </tr>
                          {actualBlock ? (
                            <tr>
                              <td className="no-brake">Current Block:</td>
                              <td>{actualBlock}</td>
                            </tr>
                          ) : (
                            <ContentLoader noPaddingOnTheSides noPaddingTop className="m-0" />
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <>
                        <p>Your account effective balance is not leased out.</p>
                      </>
                    )}
                  <div className="button-wrapper">
                    <Button
                      name={currentLessee ? 'Stack my leasing' : 'Lease your balance to another account.'}
                      color="green"
                      className="mt-2"
                      onClick={() => this.props.setBodyModalParamsAction('LEASE_BALANCE')}
                    />
                  </div>
                </div>
              </div>
            </TabContaier>
          </TabulationBody>
        </ModalBody>
      );
    }
}

const mapStateToProps = state => ({
  modalData: getModalDataSelector(state),
  account: getAccountSelector(state),
  ticker: getTickerSelector(state),
  decimals: getDecimalsSelector(state),
  accountRS: getAccountRsSelector(state),
  actualBlock: getActualBlockSelector(state),
  currentLessee: getCurrentLesseeSelector(state),
  currentLeasingHeightFrom: getCurrentLeasingHeightFromSelector(state),
  currentLeasingHeightTo: getCurrentLeasingHeightToSelector(state),
});

const mapDispatchToProps ={
  setBodyModalParamsAction,
  getAccountInfoAction,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountDetails));
