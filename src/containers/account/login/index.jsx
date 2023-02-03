import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import { useDispatch } from 'react-redux';
import { getConstantsAction } from 'actions/login';
import LogoImg from 'assets/new_apl_icon_white.svg';
import LoginModal from './login-modal';
import ImportAccount from './import-account';
import CreateUser from './create-user';
import { SECTIONS } from './constants';
import './Login.scss';

export default function Login() {
  const dispatch = useDispatch();

  const [activeSection, setActiveSection] = useState(SECTIONS.LOGIN);

  const handleModal = useCallback(section => setActiveSection(section), []);

  const handleSelectModal = useMemo(() => {
    const obj = {
      LOGIN: <LoginModal handleModal={handleModal} />,
      IMPORT_ACCOUNT: <ImportAccount handleClose={() => handleModal(SECTIONS.LOGIN)} />, 
      CREATE_USER: <CreateUser handleClose={() => handleModal(SECTIONS.LOGIN)} /> 
    }
    return obj[activeSection];
  }, [activeSection, handleModal]);

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
              {handleSelectModal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
