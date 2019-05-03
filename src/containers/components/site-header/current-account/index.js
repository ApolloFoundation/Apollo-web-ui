import React from 'react';
import {connect} from 'react-redux';

import classNames from 'classnames';

import {NavLink, withRouter} from 'react-router-dom'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {NotificationManager} from "react-notifications";

import {logOutAction} from "../../../../actions/login";
import {setBodyModalParamsAction} from '../../../../modules/modals';

const CurrentAccount = ({accountRS, account, publicKey, contacts, isContacts, isActive, setBodyModalParamsAction, history}) => (
    <div
        className={classNames({
            "no-padding": true,
            "account-body-modal-window": true,
            "account-body-modal": true,
            "active": isActive,
            "settings-menu": true,
            "settings-bar": true,
            "stop": true,
        })}>
        <div className="form-group-app">
            <div className="form-title">
                <p>Current account</p>
            </div>
            {
                !publicKey &&
                <div className="form-sub-title">
                    Not verified profile<br/>
                    <CopyToClipboard
                        text={accountRS}
                        onCopy={() => {
                            NotificationManager.success('The account has been copied to clipboard.')
                        }}
                    >
                        <a
                            className="user-account-rs blue-text d-block"
                        >
                            {accountRS}
                        </a>
                    </CopyToClipboard>
                </div>
            }
            {
                publicKey &&
                <div className="form-sub-title">
                    Verified profile<br/>
                    <CopyToClipboard
                        text={accountRS}
                        onCopy={() => {
                            NotificationManager.success('The account has been copied to clipboard.')
                        }}
                    >
                        <a
                            className="user-account-rs blue-text"
                        >
                            {accountRS}
                        </a>
                    </CopyToClipboard>
                </div>
            }
            <div className="form-body">
                <div className="input-section">
                    <div className="row" style={{position: 'relative'}}>
                        <div className="col-xc-12 col-md-6">
                            <a
                                onClick={() => setBodyModalParamsAction('SET_ACCOUNT_INFO', {})}
                                className="btn static blue block"
                            >
                                Set account info
                            </a>
                        </div>
                        <div className="col-xc-12 col-md-6">
                            <a
                                onClick={() => {

                                    if (contacts && contacts.length) {
                                        this.setState({isContacts: !isContacts})
                                    } else {
                                        NotificationManager.info('You have an empty contacts list.', null, 5000)
                                    }
                                }
                                }
                                className="btn static block"
                            >
                                Switch account
                            </a>
                        </div>
                        <div
                            className={classNames({
                                'contacts-list': true,
                                'active': isContacts
                            })}
                            style={{
                                padding: 0,
                                margin: 5
                            }}
                        >
                            <ul>
                                {
                                    contacts &&
                                    contacts.length &&
                                    contacts.map((el, index) => {
                                        return (
                                            <li>
                                                <a
                                                    onClick={() => this.props.switchAccountAction(el.accountRS, history)}
                                                >
                                                    {el.name}
                                                </a>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="input-section">
                    <a
                        style={{
                            display: 'block'
                        }}
                        onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', account)}
                        className="image-button"
                    >
                        <i className="zmdi zmdi-account"/>
                        <label style={{cursor: 'pointer'}}>Details</label>
                    </a>
                    <NavLink
                        activeClassName={'active'}
                        to="/messenger"
                        className="image-button"
                    >
                        <i className="zmdi zmdi-comments"/>
                        <label style={{cursor: 'pointer'}}>Messages</label>
                    </NavLink>

                </div>
                <div className="input-section">
                    <NavLink
                        activeClassName={'active'}
                        to="/settings"
                        className="image-button"
                    >
                        <i className="zmdi zmdi-settings"/>
                        <label style={{cursor: 'pointer'}}>Account settings</label>
                    </NavLink>
                </div>
                <div className="input-section">
                    <div
                        onClick={() => logOutAction('simpleLogOut', history)}
                        className="image-button">
                        <i className="zmdi zmdi-power"/>
                        <label style={{cursor: 'pointer'}}>Logout</label>
                    </div>
                    <div
                        onClick={() => logOutAction('logOutStopForging', history)}
                        className="image-button"
                    >
                        <i className="zmdi zmdi-pause-circle"/>
                        <label style={{cursor: 'pointer'}}>Logout and stop
                            forging</label>
                    </div>
                    <div
                        onClick={() => logOutAction('logoutClearUserData', history)}
                        className="image-button"
                    >
                        <i className="zmdi zmdi-close-circle"/>
                        <label style={{cursor: 'pointer'}}>Logout and clear user
                            data</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const mapStateToProps = state => ({
    account: state.account.account,
    accountRS: state.account.accountRS,
    publicKey: state.account.publicKey,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, values) => dispatch(setBodyModalParamsAction(type, values))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CurrentAccount));