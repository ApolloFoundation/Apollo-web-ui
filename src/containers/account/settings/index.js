/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-form';
import { NotificationManager } from 'react-notifications';
import { getSavedAccountSettingsAction, saveAccountSettingsAction } from '../../../modules/accountSettings';
import { setBodyModalParamsAction } from '../../../modules/modals';
import account, { login } from '../../../modules/account';
import {
  disable2FAActon, enable2FAActon, getAccountInfoAction,
} from '../../../actions/account';
import SiteHeader from '../../components/site-header';
import InputForm from '../../components/input-form';
import InfoBox from '../../components/info-box';
import ModalFooter from '../../components/modal-footer';
import AccountRSFormInput from '../../components/form-components/account-rs';
import './Settings.scss';

class Settings extends React.Component {
    settingsLoaded = false;

    valuesSet = false;

    componentDidMount() {
      this.getAdminPassword();
      this.props.getSavedAccountSettings();
      this.getAccountInfoAction(this.props);
      this.settingsLoaded = true;

      if (this.state.settings) {
        this.setState({ is2FA: true });
      } else {
        this.setState({ is2FA: false });
      }
    }

    state = {
      settings: null,
      adminPassword: localStorage.getItem('adminPassword') ? JSON.parse(localStorage.getItem('adminPassword')) : '',
    };

    getAccountInfoAction = async props => {
      const account = await this.props.getAccountInfoAction({ account: props ? props.account : this.props.account });

      if (account) {
        this.props.login(account);
        this.setState({ account });
      }
    };

    handleSubmit = values => {
      saveAccountSettingsAction(values);
      getSavedAccountSettingsAction();
      NotificationManager.success('Settings has been saved!');
    };

    componentWillReceiveProps = (newState, oldState) => {
      this.getAccountInfoAction(newState);
      if (newState.settings !== oldState.settings) {
        this.setState({ settings: newState.settings });
      }
      if (this.state.settings) {
        this.setState({ is2FA: true });
      } else {
        this.setState({ is2FA: false });
      }
    };

    set2faStatus = selectedOption => {
      if (selectedOption.value) {
        this.setState({ is2FA: true });
      } else {
        this.setState({ is2FA: false });
      }
    };

    getQRCode = async getFormState => {
      const { values } = getFormState();

      if (!values.account) {
        NotificationManager.error('Account ID is not specified.', 'Error', 5000);
        return;
      }

      const status = await enable2FAActon({
        passphrase: values.secretPhrase,
        account: values.account,
      });

      if (status.errorCode) {
        NotificationManager.error(status.errorDescription, null, 5000);
      } else {
        this.props.setBodyModalParamsAction('CONFIRM_2FA_OPERATION', {
          ...status,
          passphrase: values.secretPhrase,
          account: values.account,
          operation: 'enable 2FA',
          settingsReloader: this.getAccountInfoAction,
        });

        this.setState({ info2fa: status });
      }
    };

    disable2fa = async getFormState => {
      const { values } = getFormState();

      if (!values.account) {
        NotificationManager.error('Account ID is not specified.', 'Error', 5000);
        return;
      }

      const status = await disable2FAActon({
        passphrase: values.secretPhrase,
        account: values.account,
        code2FA: values.code2FA,
      });

      if (status.errorCode) {
        NotificationManager.error(status.errorDescription, null, 5000);
      } else {
        this.getAccountInfoAction();
        NotificationManager.success('2FA was successfully disabled.', null, 5000);
      }
    };

    getAdminPassword = () => {
      const adminPassword = localStorage.getItem('adminPassword');

      if (adminPassword) {
        this.setState({ adminPassword: JSON.parse(adminPassword) });
      }
    };

    handleGeneralSettingFormSubmit = values => {
      const adminPassword = JSON.stringify(values.adminPassword);

      if (adminPassword) {
        localStorage.setItem('adminPassword', adminPassword);
        NotificationManager.success('Admin password has been successfully saved!', null, 5000);
      }
    };

    render() {
      return (
        <div className="page-content">
          <SiteHeader pageTitle="Settings" />
          <div className="page-body container-fluid full-screen-block">
            <div className="account-settings">
              <div className="row">
                <div className="page-settings-item col-sm-6 pl-0 pr-0 mb-3">
                  <div className="card full-height">
                    <div className="card-title">Two Factor Authentication (2FA)</div>
                    <div className="card-body">
                      <Form
                        onSubmit={values => this.handleFormSubmit(values)}
                        render={({
                          submitForm, setValue, values, getFormState,
                        }) => (
                          <form className="modal-form" onSubmit={submitForm}>
                              <div className="form-group-app">
                                {this.props.is2FA
                                  ? (
                                    <>
                                      <div className="form-sub-title mb-3">
                                        The 2FA is currently enabled on this account.
                                      </div>
                                    </>
                                  ) : (
                                    <div className="form-sub-title mb-3">
                                      The 2FA is currently disabled on this account. You can
                                      increase
                                      your wallet security with this option.
                                    </div>
                                  )}
                                <InfoBox attentionLeft>
                                  <p className="mb-3">
                                    Please note:
                                  </p>
                                  <div className="form-sub-title">
                                    2FA is a feature for Vault addresses only,
                                    and will not add a second factor authentication to a standard address.
                                  </div>
                                </InfoBox>
                                <AccountRSFormInput
                                  setValue={setValue}
                                  noContactList
                                  field="account"
                                  label="Account ID"
                                  placeholder="Account ID"
                                  defaultValue={values.account || ''}
                                />
                                <ModalFooter
                                  setValue={setValue}
                                />
                                {this.state.account && (
                                <div>
                                  {!this.state.account.is2FA ? (
                                    <button
                                      type="button"
                                      className="btn btn-green"
                                      onClick={() => this.getQRCode(getFormState)}
                                    >
                                      Get Qr code
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className="btn btn-green"
                                      onClick={() => this.disable2fa(getFormState)}
                                    >
                                        Confirm disable
                                    </button>
                                  )}
                                </div>
                                )}
                              </div>
                            </form>
                        )}
                      />
                    </div>
                  </div>
                </div>
                {this.props.isLocalhost && (
                  <div className="page-settings-item col-sm-6 pr-0 mb-3">
                    <div className="card full-height">
                      <div className="card-title">General</div>
                      <div className="card-body">
                        <Form
                          onSubmit={values => this.handleGeneralSettingFormSubmit(values)}
                          render={({
                            submitForm, setValue, values, addValue, removeValue, getFormState,
                          }) => (
                            <form className="modal-form" onSubmit={submitForm}>
                              <div className="form-group-app">
                                <div className="form-group mb-15">
                                  <label>
                                    Admin password
                                  </label>
                                  <div>
                                    <InputForm
                                      isPlain
                                      className="form-control"
                                      type="password"
                                      field="adminPassword"
                                      placeholder="Admin password"
                                      setValue={setValue}
                                      defaultValue={this.state.adminPassword}
                                    />
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  className="btn btn-green"
                                >
                                  Save
                                </button>
                              </div>
                            </form>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
}

const mapStateToProps = state => ({
  settings: state.accountSettings,
  is2FA: state.account.is2FA,
  account: state.account.account,
  isLocalhost: state.account.isLocalhost,
});

const mapDispatchToProps = dispatch => ({
  getSavedAccountSettings: () => dispatch(getSavedAccountSettingsAction()),
  setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  getAccountInfoAction: account => dispatch(getAccountInfoAction(account)),
  login: account => dispatch(login(account)),

});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
