import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { NavLink, withRouter } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationManager } from "react-notifications";

import { logOutAction } from "../../../../actions/login";
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { readFromLocalStorage } from '../../../../actions/localStorage';
import {
    getAccountPublicKeySelector, getAccountRsSelector, getAccountSelector, getForgingStatusSelector
} from '../../../../selectors';

class CurrentAccount extends React.Component {
    refContactsList = React.createRef();
    refContactsButton = React.createRef();

    state = {
        contacts: null,
        isContacts: false,
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        const contactList = readFromLocalStorage('APLContacts');
        if(contactList) {
            this.setState({
                contacts: JSON.parse(contactList),
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperContactsButtonRef = (node) => {
        this.refContactsButton = node;
    };

    setWrapperContactsRef = (node) => {
        this.refContactsList = node;
    };

    handleClickOutside = (event) => {
        if (this.state.isContacts &&
            this.refContactsList && !this.refContactsList.contains(event.target) &&
            this.refContactsButton &&  !this.refContactsButton.contains(event.target)) {
            this.setState({
                isContacts: false
            });
        }
    };

    handleContacts = () => {
        if (this.state.contacts && !!this.state.contacts.length) {
            this.setState({
                isContacts: !this.state.isContacts
            })
        } else {
            NotificationManager.info('You have an empty contacts list.', null, 5000)
        }
    };

    render() {
        const {accountRS, account, publicKey, isActive, setBodyModalParamsAction, history, switchAccountAction, forgingStatus, closeMenu} = this.props;

        return (
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
                        <button type="button" onClick={closeMenu} className="exit current-account">
                            <i className="zmdi zmdi-close"/>
                        </button>
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
                                        className="btn btn-green block"
                                    >
                                        Set account info
                                    </a>
                                </div>
                                <div className="col-xc-12 col-md-6">
                                    <button
                                        type={'button'}
                                        ref={this.setWrapperContactsButtonRef}
                                        onClick={() => this.handleContacts()}
                                        className="btn btn-default block"
                                    >
                                        Switch account
                                    </button>
                                </div>
                                {this.state.contacts && (
                                <div
                                    ref={this.setWrapperContactsRef}
                                    className={classNames({
                                        'contacts-list': true,
                                        'active': this.state.isContacts
                                    })}
                                    style={{
                                        padding: 0,
                                        margin: '0 5px 5px 5px'
                                    }}
                                >
                                    <ul>
                                        {
                                            this.state.contacts &&
                                            this.state.contacts.length &&
                                            this.state.contacts.map((el, index) => {
                                                return (
                                                    <li>
                                                        <a
                                                            onClick={() => switchAccountAction(el.accountRS, history)}
                                                        >
                                                            {el.name}
                                                        </a>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                                )}
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
                            {forgingStatus &&
                            !forgingStatus.errorCode && (
                                <div
                                    onClick={() => logOutAction('logOutStopForging', history)}
                                    className="image-button"
                                >
                                    <i className="zmdi zmdi-pause-circle"/>
                                    <label style={{cursor: 'pointer'}}>Logout and stop forging</label>
                                </div>
                            )}
                            <div
                                onClick={() => logOutAction('logoutClearUserData', history)}
                                className="image-button"
                            >
                                <i className="zmdi zmdi-close-circle"/>
                                <label style={{cursor: 'pointer'}}>
                                    Logout and clear userdata
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    account: getAccountSelector(state),
    accountRS: getAccountRsSelector(state),
    publicKey: getAccountPublicKeySelector(state),
    forgingStatus: getForgingStatusSelector(state),
});

const mapDispatchToProps = {
    setBodyModalParamsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CurrentAccount));
