/** ****************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { getConstantsAction } from '../../../actions/login';
import AccountIdForm from './forms/viaAccountIdForm';
import SecretPhraseForm from './forms/viaSecretPhraseForm';
import ImportAccount from './import-account';
import CreateUser from './create-user';

import LogoImg from '../../../assets/logo.png';
import './Login.scss';

export default function Login() {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const [activeSection, setActiveSection] = useState('LOGIN');

  const handleTab = useCallback((e, index) => {
    e.preventDefault();

    setActiveTab(index);
  }, []);

  const selectForm = useMemo(() => {
    if (activeTab === 0) {
      return <AccountIdForm activeTab={activeTab} />;
    }
    if (activeTab === 1) {
      return <SecretPhraseForm activeTab={activeTab} />;
    }

    return null;
  }, [activeTab]);

  const handleModal = useCallback(section => setActiveSection(section), []);

  useEffect(() => {
    dispatch(getConstantsAction());
  }, [dispatch]);

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
                      {selectForm}
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
