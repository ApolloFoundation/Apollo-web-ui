/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSavedAccountSettingsAction } from 'modules/accountSettings';
import { login } from 'modules/account';
import { getAccountInfoAction } from 'actions/account';
import SiteHeader from 'containers/components/site-header';
import { 
  getAccountSelector,
  getSettingsSelector,
  getIsLocalhostSelector,
} from 'selectors';
import { Settings2FAForm } from './Settings2FAForm';
import { AdminPasswordForm } from './AdminPasswordForm';
import './Settings.scss';

const Settings = () => {
  const dispatch = useDispatch();
  const account = useSelector(getAccountSelector);
  const settings = useSelector(getSettingsSelector);
  const isLocalhost = useSelector(getIsLocalhostSelector);

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
                  <Settings2FAForm
                    account={state.account}
                    getAccountInfo={getAccountInfo}
                    setState={setState}
                  />
                </div>
              </div>
            </div>
            {isLocalhost && (
              <div className="page-settings-item col-sm-6 pr-0 mb-3">
                <div className="card full-height">
                  <div className="card-title">General</div>
                  <div className="card-body">
                    <AdminPasswordForm />
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
