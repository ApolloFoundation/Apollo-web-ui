import React from 'react';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import NoApprovalBody from './body/NoApprovalBody';
import ApproveByAccountBody from './body/ApproveByAccountBody';
import ApproveByBalanceBody from './body/ApproveByBalanceBody';
import ApproveWithAssetBody from './body/ApproveWithAssetBody';
import ApproveWithCurrencyBody from './body/ApproveWithCurrencyBody';
import submitForm from '../../../helpers/forms/forms';
import { updateAccount } from '../../../actions/login/index';

import ModalBody from '../../components/modals/modal-body';
import TabulationBody from '../../components/tabulator/tabuator-body';
import TabContaier from '../../components/tabulator/tab-container';

// TODO: extract to constants
const tabs = [
  'No approval',
  'Approve by account',
  'Approve by balance',
  'Approve with asset',
  'Approve with currency',
];
// TODO update

class MandatoryApprovalModal extends React.Component {
    state = {
      activeForm: 0,
      noApproval: null,
      approveByAcc: null,
      approveByBalance: null,
      approveWithAsset: null,
      approveWithCurrency: null,
    };

    tabSelected = tabIndex => {
      this.setState({ activeTab: tabIndex });
    };

    onSubmit = values => {
      const { processForm, updateAccount, account } = this.props;

      values = {
        controlVotingModel: this.state.activeForm - 1,
        phasingHashedSecretAlgorithm: 2,
        ...values,
      };

      processForm(values, 'setPhasingOnlyControl', null, res => {
        NotificationManager.success('Control has been setup!', null, 5000);
        setTimeout(() => {
          updateAccount({ account });
        }, 1000);
      });
    }

    onFocus = activeForm => {
      this.setState({ activeForm });
    }

    handleFormSubmit = values => {
      const { activeForm } = this.state;

      switch (activeForm) {
        case 0:
          this.onSubmit({ ...values, ...this.state.noApproval });
          break;

        case 1:
          this.onSubmit({ ...values, ...this.state.approveByAccountBody });
          break;

        case 2:
          this.onSubmit({ ...values, ...this.state.approveByBalanceBody });
          break;

        case 3:
          this.onSubmit({ ...values, ...this.state.approveWithAssetBody });
          break;

        case 4:
          this.onSubmit({ ...values, ...this.state.approveWithCurrencyBody });
          break;

        default:
      }
    }

    handleApproveby = ({ values }, field) => {
      this.setState({ [field]: values });
    }

    render() {
      return (
        <ModalBody
          handleFormSubmit={values => this.handleFormSubmit(values)}
          modalTitle="Mandatory Approval"
          isAdvanced
          modalSubTitle="All subsequent transactions will be mandatory approved (phased) according to whatever is set below. Once set, this account control can only be removed with the approval of the accounts/stake holders set below."
          submitButtonName="Submit"
          isAdvancedWhite
          isDisableSecretPhrase
        >
          <TabulationBody
            className="p-0 gray-form"
            onFocus={i => this.onFocus(i)}
          >
            <TabContaier
              sectionName={<i className="zmdi zmdi-close-circle" />}
            >
              <NoApprovalBody
                onChange={values => this.handleApproveby(values, 'noApproval')}
                ticker={this.props.ticker}
              />
            </TabContaier>
            <TabContaier
              sectionName={<i className="zmdi zmdi-accounts" />}
              onFocus={() => this.onFocus(1)}
            >
              <ApproveByAccountBody
                onChange={values => this.handleApproveby(values, 'approveByAccountBody')}
                ticker={this.props.ticker}
              />
            </TabContaier>
            <TabContaier
              sectionName={<i className="zmdi zmdi-money-box" />}
              onFocus={() => this.onFocus(2)}
            >
              <ApproveByBalanceBody
                onChange={values => this.handleApproveby(values, 'approveByBalanceBody')}
                ticker={this.props.ticker}
              />
            </TabContaier>
            <TabContaier
              sectionName={<i className="zmdi zmdi-chart" />}
              onFocus={() => this.onFocus(3)}
            >
              <ApproveWithAssetBody
                onChange={values => this.handleApproveby(values, 'approveWithAssetBody')}
                ticker={this.props.ticker}
              />
            </TabContaier>
            <TabContaier
              sectionName={<i className="zmdi zmdi-balance" />}
              onFocus={() => this.onFocus(4)}
            >
              <ApproveWithCurrencyBody
                onChange={values => this.handleApproveby(values, 'approveWithCurrencyBody')}
                ticker={this.props.ticker}
              />
            </TabContaier>
          </TabulationBody>
        </ModalBody>
      );
    }
}

const mapStateToProps = state => ({
  publicKey: state.account.publicKey,
  account: state.account.account,
  ticker: state.account.ticker,
});

const mapDispatchToProps = dispatch => ({
  submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
  updateAccount: account => dispatch(updateAccount(account)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MandatoryApprovalModal);

/*

 submitNoApproval = async toSend => {

        console.log(this.state.noApproval)

        const mappedRequestBody = {
            controlVotingModel: -1,
            controlMinDuration: null,
            controlMaxDuration: null,
            phased: false,
            phasingLinkedFullHash: null,
            phasingHashedSecret: null,
            phasingHashedSecretAlgorithm: 2,
            publicKey: this.props.publicKey,
            secretPhrase: toSend.secretPhrase,
            feeATM: toSend.fee,
            controlMaxFees: 0,
            ...toSend,
            ...this.state.noApproval,
        };

        console.log(mappedRequestBody)

        if (!mappedRequestBody.secretPhrase || mappedRequestBody.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const res = await this.props.submitForm(mappedRequestBody, "setPhasingOnlyControl");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Control has been setup!', null, 5000);
        }
    };

    submitApproveByAcc = async toSend => {

        const mappedRequestBody = {
            controlQuorum: toSend.phasingQuorum,
            controlMinBalanceModel: toSend.phasingMinBalanceModel,
            controlVotingModel: 0,
            controlMinDuration: toSend.minDuration,
            controlMaxDuration: toSend.maxDuration,
            deadline: 1440,
            phased: false,
            secretPhrase: toSend.secretPhrase,
            phasingLinkedFullHash: null,
            phasingHashedSecret: null,
            phasingHashedSecretAlgorithm: 2,
            publicKey: this.props.publicKey,
            feeATM: toSend.fee,
            controlMaxFees: toSend.maxFees,
            ...this.state.approveByAccountBody,
            ...toSend
        };

        if (!mappedRequestBody.secretPhrase || mappedRequestBody.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const res = await this.props.submitForm(mappedRequestBody, "setPhasingOnlyControl");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Control has been setup!', null, 5000);
        }
    };

    submitApproveByBalance = async toSend => {
        if (!toSend.secretPhrase || toSend.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const object = {
            controlWhitelisted: toSend.phasingWhitelisted,
            controlMinBalanceModel: toSend.phasingMinBalanceModel,
            controlVotingModel: 1,
            controlMinDuration: toSend.minDuration,
            controlMaxDuration: toSend.maxDuration,
            deadline: 1440,
            phased: false,
            phasingHashedSecretAlgorithm: 2,
            publicKey: this.props.publicKey,
            secretPhrase: toSend.secretPhrase,
            feeATM: toSend.fee,
            controlQuorum: toSend.amount,
            controlMaxFees: toSend.maxFees,
            ...this.state.approveByBalanceBody
        };
        const res = await this.props.submitForm(object, "setPhasingOnlyControl");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Control has been setup!', null, 5000);
        }
    };

    submitApproveWithAsset = async toSend => {
        if (!toSend.secretPhrase || toSend.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const object = {
            controlQuorumATUf: toSend.assetQuantity,
            controlHolding: "",
            controlWhitelisted: 1,
            controlMinBalanceModel: 0,
            controlVotingModel: 0,
            controlMinDuration: toSend.minDuration,
            controlMaxDuration: toSend.maxDuration,
            deadline: 1440,
            phased: false,
            phasingHashedSecretAlgorithm: 2,
            publicKey: this.props.publicKey,
            feeATM: toSend.fee,
            controlMaxFees: toSend.maxFees,
            secretPhrase: toSend.secretPhrase,
            ...this.state.approveWithAssetBody
        };
        const res = await this.props.submitForm(object, "setPhasingOnlyControl");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Control has been setup!', null, 5000);
        }
    };

    submitApproveWithCurrency = async toSend => {

        if (!toSend.secretPhrase || toSend.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const object = {
            controlWhitelisted: 1,
            controlMinBalanceModel: 0,
            controlVotingModel: 3,
            controlMinDuration: toSend.minDuration,
            controlMaxDuration: toSend.maxDuration,
            deadline: 1440,
            phased: false,
                    phasingHashedSecretAlgorithm: 2,
            publicKey: this.props.publicKey,
            feeATM: toSend.fee,
            controlMaxFees: toSend.maxFees,
            secretPhrase: toSend.secretPhrase,
            controlQuorum: toSend.currencyUnits,
            ...this.state.approveWithCurrencyBody
        }

        const res = await this.props.submitForm(object, "setPhasingOnlyControl");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Control has been setup!', null, 5000);
        }
    };

    */
