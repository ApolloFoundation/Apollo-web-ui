/** ****************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Text } from 'react-form';
import { NotificationManager } from 'react-notifications';
import {
  getConstantsAction,
  getAccountDataAction,
  getAccountDataBySecretPhrasseAction,
} from '../../../actions/login';
import AccountRS from '../../components/account-rs';
import InfoBox from '../../components/info-box';
import ImportAccount from './import-account';
import CreateUser from './create-user';

import LogoImg from '../../../assets/logo.png';
import './Login.scss';

export default function Login() {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const [activeSection, setActiveSection] = useState('LOGIN');

  const { account } = useSelector(state => state.account);

  useEffect(() => {
    dispatch(getConstantsAction());
  }, [dispatch]);

  const enterAccount = useCallback(({ accountRS }) => {
    if (!accountRS || accountRS.length === 0) {
      NotificationManager.error('Account ID is required.', 'Error', 5000);
      return;
    }

    dispatch(getAccountDataAction({ account: accountRS }));
  }, [dispatch]);

  const enterAccountByPassphrase = useCallback(({ secretPhrase }) => {
    if (!secretPhrase || secretPhrase.length === 0) {
      NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
      return;
    }

    dispatch(getAccountDataBySecretPhrasseAction({ secretPhrase }));
  }, [dispatch]);

  const handleTab = useCallback((e, index) => {
    e.preventDefault();

    setActiveTab(index);
  }, []);

  const handleModal = useCallback(section => setActiveSection(section), []);

  return (
    <div className="page-content">
      <div className="page-body container-fluid">
        <div className="login">
          <div className="login-wrap">
            <div className="left-section">
              <img className="logo" src={LogoImg} alt="Apollo" />
              <div className="flex-column">
                <p className="title">
                  Welcome Home,
                  <br />
                  Apollonaut!
                </p>
                <p className="sub-title">Apollo command center</p>
              </div>
            </div>
            <div className="right-section">
              {activeSection === 'LOGIN' && (
                <div>
                  <div className="dark-card login-form">
                    <p className="title">Log in</p>
                    <div className="form-tabulator">
                      <div className="form-tab-nav-box">
                        <button
                          type="button"
                          onClick={e => handleTab(e, 0)}
                          className={classNames({
                            'form-tab': true,
                            active: activeTab === 0,
                          })}
                        >
                          <p>With Account ID</p>
                        </button>
                        <button
                          type="button"
                          onClick={e => handleTab(e, 1)}
                          className={classNames({
                            'form-tab': true,
                            active: activeTab === 1,
                          })}
                        >
                          <p>With Secret Phrase</p>
                        </button>
                      </div>
                      {activeTab === 0
                        && (
                        <Form
                          onSubmit={values => enterAccount(values)}
                          render={({ submitForm, setValue }) => (
                            <form
                              onSubmit={submitForm}
                              className={classNames({
                                'tab-body mt-4': true,
                                active: activeTab === 0,
                              })}
                            >
                              <div className="input-group-app user">
                                <div>
                                  <label htmlFor="recipient">
                                    Enter your ID or choose from saved
                                  </label>
                                  <div>
                                    <div className="iconned-input-field">
                                      <AccountRS
                                        value=""
                                        field="accountRS"
                                        setValue={setValue}
                                        placeholder="Account ID"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <button
                                type="submit"
                                name="closeModal"
                                className="btn"
                              >
                                Initiate
                              </button>
                            </form>
                          )}
                        />
                        )}
                      {activeTab === 1 && (
                        <Form
                          onSubmit={values => enterAccountByPassphrase(values)}
                          render={({ submitForm }) => (
                            <>
                              <form
                                onSubmit={submitForm}
                                className={classNames({
                                  'tab-body': true,
                                  active: activeTab === 1,
                                })}
                              >
                                <InfoBox className="green-text" transparent>
                                  This option works only for standard wallets.
                                </InfoBox>
                                <div className="d-flex flex-column">
                                  <label>
                                    Secret Phrase
                                  </label>
                                  <div>
                                    <Text
                                      className="form-control"
                                      field="secretPhrase"
                                      placeholder="Secret Phrase"
                                      type="password"
                                    />
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  name="closeModal"
                                  className="btn"
                                >
                                  Initiate
                                </button>
                              </form>
                            </>
                          )}
                        />
                      )}
                    </div>
                  </div>
                  <div
                    className="button-block"
                    onClick={() => handleModal('IMPORT_ACCOUNT')}
                  >
                    <span className="title">Advanced user?</span>
                    <span className="sub-title">Import Vault Wallet</span>
                  </div>
                  <div
                    className="button-block"
                    onClick={() => handleModal('CREATE_USER')}
                  >
                    <span className="title">New user?</span>
                    <span className="sub-title">Create Apollo Wallet</span>
                  </div>
                </div>
              )}
              {activeSection === 'IMPORT_ACCOUNT' && (
                <ImportAccount handleClose={() => handleModal('LOGIN')} />
              )}
              {activeSection === 'CREATE_USER' && (
                <CreateUser handleClose={() => handleModal('LOGIN')} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
