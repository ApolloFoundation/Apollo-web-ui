/** ****************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getConstantsAction } from '../../../actions/login';
import LoginModal from './login-modal';
import ImportAccount from './import-account';
import CreateUser from './create-user';

import LogoImg from '../../../assets/logo.png';
import './Login.scss';

export default function Login() {
  const dispatch = useDispatch();

  const [activeSection, setActiveSection] = useState('LOGIN');

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
              {activeSection === 'LOGIN'
                && (<LoginModal handleModal={handleModal} />)}
              {activeSection === 'IMPORT_ACCOUNT'
                && (<ImportAccount handleClose={() => handleModal('LOGIN')} />)}
              {activeSection === 'CREATE_USER'
                && (<CreateUser handleClose={() => handleModal('LOGIN')} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
