/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { Text } from 'react-form';
import classNames from 'classnames';
import {
  openPrevModal,
  saveSendModalState,
  setAlert,
  setBodyModalParamsAction,
  setModalData,
} from '../../../modules/modals';
import { confirm2FAActon } from '../../../actions/account';
import { getAccountDataAction } from '../../../actions/login';
import InfoBox from '../../components/info-box';
import crypto from '../../../helpers/crypto/crypto';
import submitForm from '../../../helpers/forms/forms';
import BackForm from '../modal-form/modal-form-container';

const mapStateToProps = state => ({
  modalData: state.modals.modalData,
  modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
  setModalData: data => dispatch(setModalData(data)),
  submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
  setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  setAlert: (type, message) => dispatch(setAlert(type, message)),
  validatePassphrase: passPhrase => dispatch(crypto.validatePassphrase(passPhrase)),
  getAccountIdAsyncApl: passPhrase => dispatch(crypto.getAccountIdAsyncApl(passPhrase)),
  getAccountDataAction: reqParams => dispatch(getAccountDataAction(reqParams)),
  saveSendModalState: Params => dispatch(saveSendModalState(Params)),
  openPrevModal: () => dispatch(openPrevModal()),
});

class Confirm2FA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      generatedPassphrase: null,
      generatedAccount: null,
      isValidating: false,
      isAccountLoaded: false,
      isPending: false,
    };
  }

    handleFormSubmit = async values => {
      if (!this.state.isPending) {
        this.setState({ isPending: true });
        values = {
          ...values,
          passphrase: this.props.modalData.passphrase,
          account: this.props.modalData.account,
        };

        const confirm = await confirm2FAActon(values);

        if (confirm) {
          if (confirm.errorCode) {
            NotificationManager.error(confirm.errorDescription, 'Error', 5000);
          } else {
            if (this.props.modalData.settingsReloader) {
              this.props.modalData.settingsReloader();
            }
            this.props.setBodyModalParamsAction(null, {});
            this.props.closeModal();

            NotificationManager.success('2FA was successfully enabled!', null, 5000);
          }
        }
        this.setState({ isPending: false });
      }
    };

    render() {
      return (
        <div className="modal-box">
          <BackForm
            nameModal={this.props.nameModal}
            onSubmit={values => this.handleFormSubmit(values)}
            render={({
              submitForm, values, addValue, removeValue, getFormState,
            }) => (
              <form
                className="modal-form"
                onChange={() => this.props.saveSendModalState(values)}
                onSubmit={submitForm}
              >
                <div className="form-group-app">
                  <button type="button" onClick={() => this.props.closeModal()} className="exit">
                    <i
                      className="zmdi zmdi-close"
                    />
                  </button>

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
                    <p>Confirm 2FA enabling</p>
                  </div>
                  <div className="form-group mb-15">
                    <label>Your Google Authenticate QR code:</label>
                    <div>
                      {
                        this.props.modalData
                        && this.props.modalData.qrCodeUrl
                        && <img src={this.props.modalData.qrCodeUrl} alt="" />
                      }
                    </div>
                  </div>
                  <InfoBox attentionLeft>
                    <p className="mb-3">
                      Please note:
                    </p>
                    2FA is a feature for Vault addresses only,
                    and will not add a second factor authentication to a standard address.
                  </InfoBox>
                  <div className="form-group mb-15">
                    <label>Your generated secret word:</label>
                    <div>
                      <InfoBox info>
                        {
                          this.props.modalData
                          && this.props.modalData.secret
                        }
                      </InfoBox>
                    </div>
                  </div>
                  <div className="form-group mb-15">
                    <label>2FA code</label>
                    <div>
                      <Text
                        type="password"
                        field="code2FA"
                        placeholder="2FA code"
                      />
                    </div>
                  </div>
                  <div className="btn-box right-conner align-right form-footer">
                    <button
                      type="submit"
                      name="closeModal"
                      className={classNames({
                        'btn btn-green submit-button': true,
                        'loading btn-green-disabled': this.state.isPending,
                      })}
                    >
                      <div className="button-loader">
                        <div className="ball-pulse">
                          <div />
                          <div />
                          <div />
                        </div>
                      </div>
                      <span className="button-text">Confirm enable</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          />
        </div>
      );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Confirm2FA);
