/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from "react";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import classNames from 'classnames';
import {setBodyModalParamsAction, setBodyModalType} from "modules/modals";
import {switchAccountAction} from "actions/account";
import {getForging, setForging} from 'actions/login';
import {
    getBlockchainStatusSelector,
    getBodyModalTypeSelector,
    getEffectiveBalanceAplSelector,
    getIsLocalhostSelector,
    getModalTypeSelector,
    getPassPhraseSelector,
    getSettingsSelector
} from "selectors";
import { readFromLocalStorage } from "actions/localStorage";
import PageTitleBox from './page-title-box';
import UserBox from './user-box';
import CurrentAccount from './current-account';
import Settings from './settings';

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';
import './SiteHeader.scss';
import './BodyModals.scss';

class SiteHeader extends React.Component {
    state = {
        menuShow: false,
        showTitleForginMenu: false,
    };

    showMenu = () => {
        this.setState({menuShow: !this.state.menuShow});
    }

    closeMenu = () => {
        this.setState({
            menuShow: false,
            bodyModalType: null
        });
    }

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
            pageTitle,
            children,
            dashboardPage,
            history,
        } = this.props;
        const {
            menuShow,
            bodyModalType,
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
                    className={classNames('overflow-menu', { hidden: !bodyModalType })}
                    onClick={this.handleModal}
                >
                    <CurrentAccount
                        setBodyModalParamsAction={setBodyModalParamsAction}
                        switchAccountAction={switchAccountAction}
                        history={history}
                        isActive={bodyModalType === "ACCOUNT_BODY_MODAL"}
                        closeMenu={this.closeMenu}
                    />
                    <Settings
                        isActive={bodyModalType === "SETTINGS_BODY_MODAL"}
                        closeMenu={this.closeMenu}
                    />
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    modalType: getModalTypeSelector(state),
    bodyModalType: getBodyModalTypeSelector(state),
    secretPhrase: getPassPhraseSelector(state),
    settings: getSettingsSelector(state),
    appState: getBlockchainStatusSelector(state),
    isLocalhost: getIsLocalhostSelector(state),
    effectiveBalanceAPL: getEffectiveBalanceAplSelector(state),
});

const mapDispatchToProps = {
    setBodyModalType,
    setForging,
    getForging,
    switchAccountAction,
    setBodyModalParamsAction,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SiteHeader));
