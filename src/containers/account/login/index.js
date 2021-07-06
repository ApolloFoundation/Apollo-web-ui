import React, {
useState, useCallback, useEffect, useMemo,
} from 'react';
import { connect } from 'react-redux';
import { getConstantsAction } from '../../../actions/login';
import LogoImg from '../../../assets/new_apl_icon_white.svg';
import LoginModal from './login-modal';
import ImportAccount from './import-account/index1';
import CreateUser from './create-user';
import './Login.scss';

function Login({ getConstants }) {
    const [activeSection, setActiveSection] = useState('LOGIN');

    const handleModal = useCallback(section => setActiveSection(section), []);

    const handleSelectModal = useMemo(() => {
        if (activeSection === 'LOGIN') {
        return <LoginModal handleModal={handleModal} />;
        }
        if (activeSection === 'IMPORT_ACCOUNT') {
        return <ImportAccount handleClose={() => handleModal('LOGIN')} />;
        }
        if (activeSection === 'CREATE_USER') {
        return <CreateUser handleClose={() => handleModal('LOGIN')} />;
        }

        return null;
    }, [activeSection, handleModal]);

    useEffect(() => {
        getConstants();
    }, [getConstants]);

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

const mapDispatchToProps = {
    getConstants: getConstantsAction,
}

export default connect(null, mapDispatchToProps)(Login);
