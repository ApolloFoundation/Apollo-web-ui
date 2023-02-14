import React, { useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { setBodyModalParamsAction } from "modules/modals";
import ApolloLogo from "assets/new_apl_icon_black.svg";
import { getAccountRsSelector, getBlockchainStatusSelector } from 'selectors';
import IconndeButton from '../iconned-button';
import CurrentAccountIcon from '../current-account/current-account-icon';
import MobieMenu from '../mobile-menu/';
import { InputSearchForm } from './InputSearch'

const UserBox = ({setBodyModalType, menuShow, showMenu, closeMenu}) => {
    const dispatch = useDispatch();
    const accountRS = useSelector(getAccountRsSelector);
    const appState = useSelector(getBlockchainStatusSelector, shallowEqual);
    const [searching, setSearching] = useState(false);

    const handleSendApollo = () => dispatch(setBodyModalParamsAction('SEND_APOLLO'));

    const handleGeneralInfoModal = () => dispatch(setBodyModalParamsAction('GENERAL_INFO'));
    
    const handleInfoNetworkModal = () => dispatch(setBodyModalParamsAction('INFO_NETWORK'));
    
    const handleLogoutExchangeModal = () => dispatch(setBodyModalParamsAction('LOGOUT_EXCHANGE'));
    // action from index file
    const handleModalSettings = () => setBodyModalType('SETTINGS_BODY_MODAL');
    const handleAccount = () => setBodyModalType('ACCOUNT_BODY_MODAL');

    return (
        <div className={
            classNames('user-search-box', {
                "searching": searching
            })}
        >
            <Link className="logo" to="/">
                <img src={ApolloLogo} alt=''/>
            </Link>
            <div className='search-bar'>
                <div className="user-account-actions">
                    <CopyToClipboard
                        text={accountRS}
                        onCopy={() => 
                            NotificationManager.success('The account has been copied to clipboard.')
                        }
                    >
                        <a className="user-account-rs">
                            {accountRS}
                        </a>
                    </CopyToClipboard>
                    <IconndeButton
                        className='d-none d-sm-flex text-ellipsis'
                        id='open-send-apollo-modal-window'
                        icon={<i className="zmdi zmdi-alert-circle"/>}
                        text='Support'
                        action={'https://support.apollocurrency.com/support/home'}
                        link
                    />
                    <IconndeButton
                        id={'open-send-apollo-modal-window'}
                        icon={<i className="zmdi zmdi-balance-wallet"/>}
                        action={handleSendApollo}
                    />
                    <IconndeButton
                        id='open-settings-window'
                        icon={<i className="zmdi zmdi stop zmdi-settings"/>}
                        action={handleModalSettings}
                    />
                    <IconndeButton
                        id='open-about-apollo'
                        icon={<i className="zmdi zmdi-help"/>}
                        action={handleGeneralInfoModal}
                    />
                    {appState && (
                        <IconndeButton
                            id='open-info-apollo'
                            icon={<i className="zmdi zmdi-info"/>}
                            action={handleInfoNetworkModal}
                        />
                    )}
                    <InputSearchForm setSearching={setSearching} searching={searching} />
                </div>
            </div>
            {window.location.pathname === '/dex' && <IconndeButton
                className='logout-button'
                id='open-about-apollo'
                icon={<i className="zmdi zmdi-power"/>}
                action={handleLogoutExchangeModal}
            />}
            <div
                className="user-box cursor-pointer"
                onClick={handleAccount}
            >
                <CurrentAccountIcon/>
            </div>
            <div
                className={classNames('burger-mobile', { 'menu-open':  menuShow})}
                onClick={showMenu}
            >
                <div className="line"/>
            </div>
            <div className={classNames('mobile-nav', { 'show':  menuShow})}>
                <MobieMenu closeMenu={closeMenu}/>
            </div>
        </div>
    )
}

export default UserBox;