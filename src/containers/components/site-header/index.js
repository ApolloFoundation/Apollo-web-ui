/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from "react";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {setPageEvents} from '../../../modules/account';
import {setBodyModalParamsAction, setBodyModalType, setModalData, setModalType} from "../../../modules/modals";
import {getAccountInfoAction, switchAccountAction} from "../../../actions/account";
import {getForging, setForging} from '../../../actions/login';
import {getTransactionAction} from "../../../actions/transactions";
import {getBlockAction} from "../../../actions/blocks";
import crypto from '../../../helpers/crypto/crypto';
// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';
import {NotificationManager} from "react-notifications";

import { readFromLocalStorage } from "../../../actions/localStorage";
import PageTitleBox from './page-title-box';

import UserBox from './user-box';

import CurrentAccount from './current-account';
import Settings from './settings';

import './SiteHeader.scss';
import './BodyModals.scss';

class SiteHeader extends React.Component {
    constructor(props) {
        super(props);

        const contactsString = readFromLocalStorage('APLContacts');

        this.state = {
            searching: false,
            menuShow: false,
            isContacts: false,
            showTitleForginMenu: false,
            contacts: contactsString && JSON.parse(contactsString),
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
            Object.values(selector.classList).indexOf('active') !== -1) {
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
        if (!this.props.effectiveBalanceAPL || this.props.effectiveBalanceAPL < 1000) {
            NotificationManager.error('Your effective balance must be greater than 1000 APL to forge.', 'Error', 5000);
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
        const {
            setBodyModalParamsAction,
            switchAccountAction,
            settings,
            pageTitle,
            children,
            dashboardPage,
            history
        } = this.props;
        const {
            menuShow,
            bodyModalType,
            isContacts,
            contacts
        } = this.state;

        return (
            <>
                <div
                    className="page-header"
                    onClick={this.handleModal}
                >
                    <PageTitleBox
                        pageTitle={pageTitle}
                        children={children}
                        dashboardPage={dashboardPage}
                        setBodyModalType={this.setBodyModalType}
                    />
                    <div>
                        <UserBox
                            showMenu={this.showMenu}
                            setBodyModalType={this.setBodyModalType}
                            menuShow={menuShow}
                            closeMenu={this.closeMenu}
                        />
                    </div>
                </div>
                <div
                    className={`overflow-menu ${bodyModalType ? '' : 'hidden'}`}
                    onClick={this.handleModal}

                    //  onClick={() => this.setState({bodyModalType: null})}
                >
                    <CurrentAccount
                        setBodyModalParamsAction={setBodyModalParamsAction}
                        switchAccountAction={switchAccountAction}
                        isContacts={isContacts}
                        contacts={contacts}
                        history={history}
                        isActive={bodyModalType === "ACCOUNT_BODY_MODAL"}
                        closeMenu={this.closeMenu}
                    />
                    <Settings isLocalhost={this.props.isLocalhost} isActive={bodyModalType === "SETTINGS_BODY_MODAL"} closeMenu={this.closeMenu}/>
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
    effectiveBalanceAPL: state.account.effectiveBalanceAPL,
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
