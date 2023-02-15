/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useState, memo } from "react";
import classNames from 'classnames';
import PageTitleBox from './page-title-box';
import UserBox from './user-box';
import CurrentAccount from './current-account';
import Settings from './settings';
// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';
import './SiteHeader.scss';
import './BodyModals.scss';

const SiteHeader = ({ pageTitle, children, dashboardPage }) => {
    const [menuShow, setMenuShow] = useState(false);
    const [bodyModalType, setBodyModalType] = useState(null);
    
    const showMenu = () => {
        setMenuShow( state => !state);
    }

    const closeMenu = () => {
        setMenuShow(false);
        setBodyModalType(null);
    }

    const handleBodyModalType = (bodyModalTypeEvent, e) => {
        const selector = document.querySelector(`.${bodyModalType}`);
        if (bodyModalTypeEvent && bodyModalTypeEvent !== bodyModalType) {
            setBodyModalType(bodyModalTypeEvent);
        }

        if (selector &&
            Object.values(e.target.classList).indexOf('stop') !== -1 &&
            Object.values(selector.classList).indexOf('active') !== -1) {
                setBodyModalType(null);
        }
    }

    const handleModal = (e) => {
        const parents = e.target.closest('.settings-bar') || null;
        const btn = e.target.closest('.icon-button') || null;
        const userAvatar = e.target.closest('.user-avatar') || null;
        const name = e.target.closest('.name') || null;

        if (bodyModalType && !parents && !btn && !name && !userAvatar) {
            setBodyModalType(null);
        }
    };

    return (
        <>
            <div
                className="page-header"
                onClick={handleModal}
            >
                <PageTitleBox
                    pageTitle={pageTitle}
                    children={children}
                    dashboardPage={dashboardPage}
                />
                <div>
                    <UserBox
                        showMenu={showMenu}
                        setBodyModalType={handleBodyModalType}
                        menuShow={menuShow}
                        closeMenu={closeMenu}
                    />
                </div>
            </div>
            <div
                className={classNames('overflow-menu', { hidden: !bodyModalType })}
                onClick={handleModal}
            >
                <CurrentAccount
                    isActive={bodyModalType === "ACCOUNT_BODY_MODAL"}
                    closeMenu={closeMenu}
                />
                <Settings
                    isActive={bodyModalType === "SETTINGS_BODY_MODAL"}
                    closeMenu={closeMenu}
                />
            </div>
        </>
    );
}

export default memo(SiteHeader);
