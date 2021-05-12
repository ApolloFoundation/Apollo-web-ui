/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { getPrivateTransactions, getTransactionAction } from '../../../actions/transactions';
import {
  openPrevModal, setBodyModalParamsAction, setModalData,
} from '../../../modules/modals';
import { formatTimestamp } from '../../../helpers/util/time';
import { getBlockAction } from '../../../actions/blocks';
import crypto from '../../../helpers/crypto/crypto';
import Transaction from '../../account/transactions/transaction';
import CustomTable from '../../components/tables/table';
import TabulationBody from '../../components/tabulator/tabuator-body';
import TabContaier from '../../components/tabulator/tab-container';
import './index.scss';

class InfoBlock extends React.Component {
    state = {
      activeTab: 0,
      privateTransactions: null,
      secretPhrase: null,
      isShowPassphrase: false,
      blockInfo: null,
      modalData: null,
    };

    static getDerivedStateFromProps(props, state) {
      if (props.modalData && props.modalData !== state.modalData) {
        const isString = typeof modalData === 'string' || typeof modalData === 'number';

        if (isString) {
          this.getBlock({ height: props.modalData });
          return { modalData: props.modalData };
        }
        if (props.modalData) {
          return {
            blockInfo: props.modalData,
            modalData: props.modalData,
          };
        }
      }
      return null;
    }

    componentDidMount = () => {
      const { modalData } = this.props;
      this.checkBlock(modalData);
    };

    checkBlock = modalData => {
      const isString = typeof modalData === 'string' || typeof modalData === 'number';

      this.setState({ modalData });

      if (isString) {
        this.getBlock({ height: modalData });
      } else if (modalData) {
        this.setState({ blockInfo: modalData });
      }
    };

    getBlock = async block => {
      const blockInfo = await this.props.getBlockAction(block);
      console.log("🚀 ~ file: index.js ~ line 68 ~ InfoBlock ~ blockInfo", blockInfo)
      this.setState({ blockInfo });
    };

    handleTab(e, index) {
      e.preventDefault();

      this.setState({
        ...this.props,
        activeTab: index,
      });
    }

    getTransaction = async (modalType, transactionId) => {
      const transaction = await this.props.getTransactionAction({ transaction: transactionId });

      if (transaction) {
        this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
      }
    };

    showPrivateTransactions = async secretPhrase => {
      const isPassPhrease = await this.props.validatePassphrase(secretPhrase.secretPhrase);

      let data;

      if (isPassPhrease) {
        data = { secretPhrase: secretPhrase.secretPhrase };
      } else {
        data = { passphrase: secretPhrase.secretPhrase };
      }

      const requestParams = {
        ...secretPhrase,
        height: this.props.modalData.height,
        ...data,
      };

      const privateTransactions = await getPrivateTransactions(requestParams);

      if (privateTransactions) {
        if (!privateTransactions.errorCode) {
          this.setState({ privateTransactions: privateTransactions.transactions });
        } else {
          NotificationManager.error(privateTransactions.errorDescription, 'Error', 5000);
        }
      }
    };

    handleSohwPassphrase = () => {
      this.setState({ isShowPassphrase: !this.state.isShowPassphrase });
    };

    // TODO: migrate timesamp, migrate account to RS

    render() {
      const { blockInfo } = this.state;

      return (
        <div className="modal-box x-wide">
          {!blockInfo && (
            <div className="modal-form">
              <div className="form-group-app media-tab">
                <div className="info-box-error">Data load error</div>
              </div>
            </div>
          )}
          {
            (this.props.modalData && blockInfo)
            && (
            <div className="modal-form">
              <div className="form-group-app media-tab">
                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>
                <div className="form-title">
                  {this.props.modalsHistory.length > 1
                        && (
                        <div
                          className="backMy"
                          onClick={() => {
                            this.props.openPrevModal();
                          }}
                        />
                        )}
                  <p>
                    Block
                    {blockInfo.block}
                    {' '}
                    (
                    {blockInfo.height}
                    ) info
                  </p>
                </div>

                <TabulationBody>
                  <TabContaier sectionName="Transactions">
                    <CustomTable
                      header={[
                        {
                          name: 'Date',
                          alignRight: false,
                        }, {
                          name: 'Type',
                          alignRight: false,
                        }, {
                          name: 'Amount',
                          alignRight: true,
                        }, {
                          name: 'Fee',
                          alignRight: true,
                        }, {
                          name: 'Account',
                          alignRight: false,
                        }, {
                          name: 'Phasing',
                          alignRight: true,
                        }, {
                          name: 'Height',
                          alignRight: true,
                        }, {
                          name: 'Confirmations',
                          alignRight: true,
                        },
                      ]}
                      className="no-min-height transparent pt-4"
                      emptyMessage="No transactions found."
                      TableRowComponent={Transaction}
                      tableData={blockInfo.transactions}
                    />
                  </TabContaier>
                  <TabContaier sectionName="Executed phased transactions">
                    <p>No executed phased transactions in this block.</p>
                  </TabContaier>
                  <TabContaier sectionName="Block details">
                    <div className="transaction-table no-min-height transparent">
                      <div className="transaction-table-body transparent">
                        <table>
                          <tbody>
                            <tr>
                              <td>Previous Block Hash:</td>
                              <td className="no-white-space break-word">{blockInfo.previousBlockHash}</td>
                            </tr>
                            <tr>
                              <td>Payload Length:</td>
                              <td className="no-white-space break-word">{blockInfo.payloadLength}</td>
                            </tr>
                            <tr>
                              <td>Total Fee ATM:</td>
                              <td className="no-white-space break-word">{blockInfo.totalFeeATM / this.props.decimals}</td>
                            </tr>
                            <tr>
                              <td>Generation Signature:</td>
                              <td className="no-white-space break-word">{blockInfo.generationSignature}</td>
                            </tr>
                            <tr>
                              <td>Executed Phased Transactions:</td>
                              <td className="no-white-space break-word">{blockInfo.fullHash}</td>
                            </tr>
                            <tr>
                              <td>Generator Public Key:</td>
                              <td className="no-white-space break-word">{blockInfo.generatorPublicKey}</td>
                            </tr>
                            {/* <tr> */}
                            {/* <td>Full Hash:</td> */}
                            {/* <td>{this.props.modalData.fullHash}</td> */}
                            {/* </tr> */}
                            <tr>
                              <td>Base Target:</td>
                              <td className="no-white-space break-word">{blockInfo.baseTarget}</td>
                            </tr>
                            <tr>
                              <td>Payload Hash:</td>
                              <td className="no-white-space break-word">{blockInfo.payloadHash}</td>
                            </tr>
                            <tr>
                              <td>Number of Transactions:</td>
                              <td className="no-white-space break-word">{blockInfo.numberOfTransactions}</td>
                            </tr>
                            <tr>
                              <td>Block Signature:</td>
                              <td className="no-white-space break-word">{blockInfo.blockSignature}</td>
                            </tr>
                            <tr>
                              <td>Version:</td>
                              <td className="no-white-space break-word">{blockInfo.version}</td>
                            </tr>
                            <tr>
                              <td>Total Amount ATM:</td>
                              <td className="no-white-space break-word">{blockInfo.totalFeeATM / this.props.decimals}</td>
                            </tr>
                            <tr>
                              <td>Cumulative Difficulty:</td>
                              <td className="no-white-space break-word">{blockInfo.cumulativeDifficulty}</td>
                            </tr>
                            <tr>
                              <td>Block:</td>
                              <td className="no-white-space break-word">{blockInfo.block}</td>
                            </tr>
                            <tr>
                              <td>Height:</td>
                              <td className="no-white-space break-word">{blockInfo.height}</td>
                            </tr>
                            <tr>
                              <td>Timestamp:</td>
                              <td className="no-white-space break-word">{blockInfo.timestamp}</td>
                            </tr>
                            <tr>
                              <td>Generator:</td>
                              <td className="no-white-space break-word">{blockInfo.generatorRS}</td>
                            </tr>
                            <tr>
                              <td>Previous Block:</td>
                              <td className="no-white-space break-word">{blockInfo.previousBlock}</td>
                            </tr>
                            <tr>
                              <td>Block Generating Time:</td>
                              <td>{this.props.formatTimestamp(blockInfo.timestamp)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabContaier>
                </TabulationBody>
              </div>
            </div>
            )
          }
        </div>
      );
    }
}

const mapStateToProps = state => ({
  modalData: state.modals.modalData,
  decimals: state.account.decimals,
  modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
  getBlockAction: requestParams => dispatch(getBlockAction(requestParams)),

  validatePassphrase: passphrase => dispatch(crypto.validatePassphrase(passphrase)),
  setModalData: data => dispatch(setModalData(data)),
  getTransactionAction: data => dispatch(getTransactionAction(data)),
  setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  formatTimestamp: timestamp => dispatch(formatTimestamp(timestamp)),
  openPrevModal: Params => dispatch(openPrevModal(Params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoBlock);
