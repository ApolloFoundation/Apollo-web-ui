import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { NavLink, useHistory } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationManager } from "react-notifications";
import { logOutAction, LOGOUT_TYPE } from "actions/login";
import {
    getAccountPublicKeySelector, getAccountRsSelector, getAccountSelector, getForgingStatusSelector
} from 'selectors';
import { setBodyModalParamsAction } from 'modules/modals';
import { ContactsList } from './ContactList';
import utils from 'helpers/util/utils';
import styles from './index.module.scss';

const CurrentAccount = ({ isActive, closeMenu }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const publicKey = useSelector(getAccountPublicKeySelector);
    const account =  useSelector(getAccountSelector);
    const accountRS =  useSelector(getAccountRsSelector);
    const forgingStatus =  useSelector(getForgingStatusSelector);
    const [url, setUrl] = useState(null);

    const handleSetAccountInfoModal = () => {
        dispatch(setBodyModalParamsAction('SET_ACCOUNT_INFO', {}))
    }

    const handleAccountModal = () => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', account));

    const handleLogout = (type) =>  () => dispatch(logOutAction(type, history));

    useEffect(() => {
        utils
            .generateQrCode(accountRS)
            .then(setUrl);
    }, [accountRS]);

    if (!isActive) return null;

    return (
        <div
            className="no-padding account-body-modal-window account-body-modal settings-menu settings-bar stop active"
        >
            <div className="form-group-app">
                <div className="form-title">
                    <button type="button" onClick={closeMenu} className="exit current-account">
                        <i className="zmdi zmdi-close"/>
                    </button>
                    <p>Current account</p>
                </div>
                <div className={styles.userNameBlock}>
                    <div className="form-sub-title">
                        {publicKey ? 'Verified profile' : 'Not verified profile'}<br/>
                        <CopyToClipboard
                            text={accountRS}
                            onCopy={() => {
                                NotificationManager.success('The account has been copied to clipboard.')
                            }}
                        >
                            <a className="user-account-rs blue-text d-block">
                                {accountRS}
                            </a>
                        </CopyToClipboard>
                    </div>
                    {url && <img className={styles.qrcode} src={url} />}
                </div>
                <div className="form-body">
                    <div className="input-section">
                        <div className={classNames('row', styles.wrapper)}>
                            <div className="col-xc-12 col-md-6">
                                <a
                                    onClick={handleSetAccountInfoModal}
                                    className="btn btn-green block"
                                >
                                    Set account info
                                </a>
                            </div>
                            <ContactsList />
                        </div>
                    </div>
                    <div className="input-section">
                        <a
                            onClick={handleAccountModal}
                            className={classNames(styles.block, "image-button")}
                        >
                            <i className="zmdi zmdi-account"/>
                            <label>Details</label>
                        </a>
                        <NavLink
                            activeClassName='active'
                            to="/messenger"
                            className="image-button"
                        >
                            <i className="zmdi zmdi-comments"/>
                            <label>Messages</label>
                        </NavLink>

                    </div>
                    <div className="input-section">
                        <NavLink
                            activeClassName='active'
                            to="/settings"
                            className="image-button"
                        >
                            <i className="zmdi zmdi-settings"/>
                            <label>Account settings</label>
                        </NavLink>
                    </div>
                    <div className="input-section">
                        <div
                            onClick={handleLogout(LOGOUT_TYPE.SIMPLE)}
                            className={classNames(styles.cursor, "image-button")}
                        >
                            <i className="zmdi zmdi-power"/>
                            <label>Logout</label>
                        </div>
                        {forgingStatus &&
                        !forgingStatus.errorCode && (
                            <div
                                onClick={ handleLogout(LOGOUT_TYPE.STOP_FORGING) }
                                className={classNames(styles.cursor, "image-button")}
                            >
                                <i className="zmdi zmdi-pause-circle"/>
                                <label>Logout and stop forging</label>
                            </div>
                        )}
                        <div
                            onClick={ handleLogout(LOGOUT_TYPE.CLEAR_USER_DATA) }
                            className={classNames(styles.cursor, "image-button")}
                        >
                            <i className="zmdi zmdi-close-circle"/>
                            <label>
                                Logout and clear userdata
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CurrentAccount;
