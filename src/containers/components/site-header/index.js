/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from "react";
import {connect} from 'react-redux';
import {Link, NavLink, withRouter} from 'react-router-dom';

import {setPageEvents} from '../../../modules/account';
import classNames from 'classnames';
import {setModalType, setBodyModalType, setBodyModalParamsAction} from "../../../modules/modals";
import {Form, Text} from 'react-form';
import PrivateTransactions from "../../modals/private-transaction";
import {switchAccountAction} from "../../../actions/account";
import {setForging} from '../../../actions/login';
import store from '../../../store';
import {setModalData} from "../../../modules/modals";
import {getAccountInfoAction} from "../../../actions/account";
import {getTransactionAction} from "../../../actions/transactions";
import {getBlockAction} from "../../../actions/blocks";
import {getForging} from "../../../actions/login"
import crypto from '../../../helpers/crypto/crypto';

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';
import {NotificationManager} from "react-notifications";
import uuid from "uuid";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import accountSettings from "../../../modules/accountSettings";

import PageTitleBox from './page-title-box';

import UserBox from './user-box';
import UserBottomBox from './user-bottom-box';

import CurrentAccount   from './current-account';
import ForgingBodyModal from './forging-body-modal';
import Settings         from './settings';

import './SiteHeader.scss';
import './BodyModals.scss';

class SiteHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searching: false,
            menuShow: false,
            isContacts: false,
            showTitleForginMenu: false,
            contacts: JSON.parse(localStorage.getItem('APLContacts')),
        };

    }

    showMenu = () => {
        this.setState({menuShow: !this.state.menuShow});
    }

    closeMenu = () => {
        this.setState({
            menuShow: false,
            bodyModalType: null
        });
    }

    showHideTitleForginMenu = () => {
        this.setState({showTitleForginMenu: !this.state.showTitleForginMenu});
    }

    setSearchStateToActive = (form) => {
        clearInterval(this.searchInterval);
        if (!this.state.searching) {

            this.setState({searching: true});

        } else {
            if (form.value) this.handleSearchind(form);
        }
    };

    resetSearchStateToActive = () => {
        this.searchInterval = setTimeout(() => {
            this.setState({searching: false});
        }, 4000);
    }

    // componentWillReceiveProps = (newState) => {
    //     this.setState({forgingStatus: newState.forgingStatus});
    // }

    // componentDidUpdate = () => {
    //     if (!this.state.forgingStatus && this.props.account) {
    //         this.getForging();
    //     }
    // }

    getForging = async () => {
        const forgingStatus = await this.props.getForging();

        if (forgingStatus) {
            this.setState({forgingStatus: forgingStatus});
        }
    };

    setBodyModalType = (bodyModalType, e) => {
        const selector = document.querySelector(`.${bodyModalType}`);
        if (bodyModalType && bodyModalType !== this.state.bodyModalType) {
            this.setState({bodyModalType: bodyModalType});
        }

        if (selector &&
            Object.values(e.target.classList).indexOf('stop') !== -1 &&
            Object.values(selector.classList).indexOf('active') !== -1 ) {
            this.setState({bodyModalType: null});
        }
    }

    setForgingData = (action) => {
        return {
            getStatus: action,
            handleSuccess: (forgingStatus) => {
                this.setState({forgingStatus});
            }
        }
    };

    setForging = async (action) => {
        if (!this.props.balanceATM || (this.props.balanceATM / 100000000) < 1000) {
            NotificationManager.error('You can start forging only if your effective balance exceed 1000 APL.', 'Error', 5000);
            return;
        }
        const passPhrase = JSON.parse(localStorage.getItem('secretPhrase')) || this.props.secretPhrase;
        if (!passPhrase || this.props.is2FA) {
            this.props.setBodyModalParamsAction('CONFIRM_FORGING', this.setForgingData(action.requestType));
        } else {
            const forging = await this.props.setForging({requestType: action.requestType});

            if (forging) {
                if (!forging.errorCode) {
                    const forgingStatus = await this.props.getForging();

                    if (!forgingStatus.errorCode || forgingStatus.errorCode === 5) {
                        this.setState({forgingStatus: forgingStatus});
                    } else {
                        NotificationManager.error('Something went wrong. Please, try again later', 'Error', 5000);
                    }
                } else {
                    NotificationManager.error(forging.errorDescription, 'Error', 5000);
                }
            }
        }
    };

    handleModal = (e) => {
        const parents = e.target.closest('.settings-bar') || null;
        const btn = e.target.closest('.icon-button') || null;
        const userAvatar = e.target.closest('.user-avatar') || null;
        const name = e.target.closest('.name') || null;

        if (this.state.bodyModalType && !parents && !btn && !name && !userAvatar) {
            this.setState({bodyModalType: null})
        }

        const search = e.target.closest('.user-search-box') || null;
        if (this.state.searching && !search) {
            this.setState({searching: false})
        }
    };

    render() {
        return (
            <>
                <div
                    style={{
                        backgroundColor: this.props.settings.header !== '#F5F5F5' ? this.props.settings.header : '#F5F5F5'
                    }}
                    className="page-header"
                    onClick={this.handleModal}
                >
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6">
                                <PageTitleBox 
                                    pageTitle={this.props.pageTitle} 
                                    children={this.props.children} 
                                    dashboardPage={this.props.dashboardPage}
                                    setBodyModalType={this.setBodyModalType}
                                />
                            </div>
                            <div className="col-md-6">
                                <UserBox
                                    showMenu={this.showMenu}
                                    setBodyModalType={this.setBodyModalType}
                                    menuShow={this.state.menuShow}
                                    closeMenu={this.closeMenu}
                                />
                                <UserBottomBox/>
                            </div>
                        </div>
                    </div>
                </div>
                <div 
                    className={`overflow-menu ${this.state.bodyModalType ? '' : 'hidden'}`}
                    onClick={this.handleModal}

                    //  onClick={() => this.setState({bodyModalType: null})}
                >
                    <CurrentAccount   isActive={this.state.bodyModalType === "ACCOUNT_BODY_MODAL"}/>
                    <ForgingBodyModal isActive={this.state.bodyModalType === "FORGING_BODY_MODAL"}  closeMenu={this.closeMenu}/>
                    <Settings         isActive={this.state.bodyModalType === "SETTINGS_BODY_MODAL"} closeMenu={this.closeMenu}/>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,
    accountRS: state.account.accountRS,
    forgingStatus: state.account.forgingStatus,
    publicKey: state.account.publicKey,
    forgedBalanceATM: state.account.forgedBalanceATM,
    moalTtype: state.modals.modalType,
    modalData: state.modals.modalData,
    bodyModalType: state.modals.bodyModalType,
    secretPhrase: state.account.passPhrase,
    settings: state.accountSettings,
    appState: state.account.blockchainStatus,
    isLocalhost: state.account.isLocalhost,
    is2FA: state.account.is2FA,
    balanceATM: state.account.balanceATM,
});

const mapDispatchToProps = dispatch => ({
    setPageEvents: (prevent) => dispatch(setPageEvents(prevent)),
    setModalType: (prevent) => dispatch(setModalType(prevent)),
    setBodyModalType: (prevent) => dispatch(setBodyModalType(prevent)),
    getAccountInfoAction: (reqParams) => dispatch(getAccountInfoAction(reqParams)),
    setForging: (reqParams) => dispatch(setForging(reqParams)),
    validatePassphrse: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
    getBlockAction: (reqParams) => dispatch(getBlockAction(reqParams)),
    setModalData: (reqParams) => dispatch(setModalData(reqParams)),
    getForging: (reqParams) => dispatch(getForging(reqParams)),
    switchAccountAction: (requestParams, history) => dispatch(switchAccountAction(requestParams, history)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SiteHeader));