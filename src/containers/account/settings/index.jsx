/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-form';
import { NotificationManager } from 'react-notifications';
import { getSavedAccountSettingsAction } from '../../../modules/accountSettings';
import { setBodyModalParamsAction } from '../../../modules/modals';
import { login } from '../../../modules/account';
import {
  disable2FAActon, enable2FAActon, getAccountInfoAction,
} from '../../../actions/account';
import SiteHeader from '../../components/site-header';
import InputForm from '../../components/input-form';
import InfoBox from '../../components/info-box';
import ModalFooter from '../../components/modal-footer';
import AccountRSFormInput from '../../components/form-components/account-rs';
import { 
  getAccountSelector,
  getSettingsSelector,
  get2FASelector,
  getIsLocalhostSelector,
  getAdminPasswordSelector,
} from '../../../selectors';
import { writeToLocalStorage } from '../../../actions/localStorage';
import './Settings.scss';

const Settings = () => {
  const dispatch = useDispatch();
  const account = useSelector(getAccountSelector);
  const settings = useSelector(getSettingsSelector);
  const is2FA = useSelector(get2FASelector);
  const isLocalhost = useSelector(getIsLocalhostSelector);
  const adminPassword = useSelector(getAdminPasswordSelector);

  const [state, setState] = useState({
    settings: null,
    account: null, 
  });

  const getAccountInfo = useCallback(async () => {
    const accountResponse = await dispatch(getAccountInfoAction({ account }));

    if (accountResponse) {
      dispatch(login(accountResponse));
      setState(prevState => ({ 
        ...prevState,
        account: accountResponse,
      }));
    }
  }, [dispatch, account]);

  const getQRCode = async (values) => {
    if (!values.account) {
      NotificationManager.error('Account ID is not specified.', 'Error', 5000);
      return;
    }
    // it is a redux action but some special)
    const status = await enable2FAActon({
      passphrase: values.secretPhrase,
      account: values.account,
    });

    if (status.errorCode) {
      NotificationManager.error(status.errorDescription, null, 5000);
    } else {
      dispatch(setBodyModalParamsAction('CONFIRM_2FA_OPERATION', {
        ...status,
        passphrase: values.secretPhrase,
        account: values.account,
        operation: 'enable 2FA',
        settingsReloader: getAccountInfo,
      }));

      setState(prevState => ({ 
        ...prevState,
        info2fa: status
      }));
    }
  };

  const disable2fa = async (values) => {
    if (!values.account) {
      NotificationManager.error('Account ID is not specified.', 'Error', 5000);
      return;
    }
    // it is a redux action but some special)
    const status = await disable2FAActon({
      passphrase: values.secretPhrase,
      account: values.account,
      code2FA: values.code2FA,
    });

    if (status.errorCode) {
      NotificationManager.error(status.errorDescription, null, 5000);
    } else {
      getAccountInfo();
      NotificationManager.success('2FA was successfully disabled.', null, 5000);
    }
  };

  const handleGeneralSettingFormSubmit = ({ adminPassword }) => {
    if (adminPassword) {
      writeToLocalStorage('adminPassword', { adminPassword });
      NotificationManager.success('Admin password has been successfully saved!', null, 5000);
    }
  };

  const handleSubmit2FA = (values) => {
    state.account.is2FA ? disable2fa(values) : getQRCode(values);
  }

  useEffect(() => {
    dispatch(getSavedAccountSettingsAction());
  }, [dispatch]);

  useEffect(() => {
    getAccountInfo();
    setState(prevState => ({
      ...prevState,
      is2FA: Boolean(settings),
    }))
  }, [getAccountInfo, settings]);

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
                    onSubmit={handleSubmit2FA}
                    render={({
                      submitForm, setValue,
                    }) => (
                      <form className="modal-form" onSubmit={submitForm}>
                        <div className="form-group-app">
                          {is2FA
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
                          />
                          <ModalFooter
                            setValue={setValue}
                          />
                          {state.account && (
                          <div>
                            <button type="submit" className="btn btn-green">
                              {!state.account.is2FA ? 'Get Qr code' : 'Confirm disable'}
                            </button>
                          </div>
                          )}
                        </div>
                      </form>
                    )}
                  />
                </div>
              </div>
            </div>
            {isLocalhost && (
              <div className="page-settings-item col-sm-6 pr-0 mb-3">
                <div className="card full-height">
                  <div className="card-title">General</div>
                  <div className="card-body">
                    <Form
                      onSubmit={handleGeneralSettingFormSubmit}
                      render={({ submitForm, setValue }) => (
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
                                  defaultValue={adminPassword}
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

export default Settings;
