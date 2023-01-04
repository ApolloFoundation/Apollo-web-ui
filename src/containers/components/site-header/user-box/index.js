import React, {Component} from 'react';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import {NotificationManager} from "react-notifications";
import {connect} from 'react-redux';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {setBodyModalParamsAction} from '../../../../modules/modals';
import IconndeButton from '../iconned-button';
import CurrentAccountIcon from '../current-account/current-account-icon';
import MobieMenu from '../mobile-menu/';
import {getTransactionAction} from "../../../../actions/transactions";
import {getBlockAction} from "../../../../actions/blocks";
import {getAccountInfoAction} from "../../../../actions/account";
import ApolloLogo from "../../../../assets/new_apl_icon_black.svg";
import { InputSearchForm } from './InputSearch'

class UserBox extends Component {
    refSearchInput = React.createRef();
    state = {};

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.state.searching && this.refSearchInput && !this.refSearchInput.current.contains(event.target)) {
            this.setState({
                searching: false
            });
        }
    };

    handleSubmit = (values) => {
        if(!this.state.searching) {
            this.setState({
                searching: true,
            })
        } else {
            this.handleSearchind(values);
        }
    }

    handleSearchind = async (values) => {
        const transaction = this.props.getTransactionAction({transaction: values.value});
        const block = this.props.getBlockAction({block: values.value});
        const account = this.props.getAccountInfoAction({account: values.value});

        Promise.all([transaction, block, account])
            .then((res) => {
                const modals = ['INFO_TRANSACTION', 'INFO_BLOCK', 'INFO_ACCOUNT'];

                // check result for some objects instead of undefined
                const result = res.find((el, index) => {
                    if (el) {
                        const payload = index < 2 ? el : el.account;
                        this.props.setBodyModalParamsAction(modals[index], payload);
                        return el;
                    }
                });

                // if every element of response are undefined we make error notification about it
                if (!result) {
                    NotificationManager.error('Invalid search properties.', null, 5000);
                }
            });
    };

    render() {
        const {setBodyModalType, setBodyModalParamsAction, menuShow, showMenu, closeMenu} = this.props;

        return (
            (
                <div className={classNames({
                    "user-search-box": true,
                    "searching": this.state.searching
                })}>
                    <Link className="logo" to={"/"}>
                        <img src={ApolloLogo} alt={''}/>
                    </Link>
                    <div className='search-bar'>
                        <div className="user-account-actions">
                            <CopyToClipboard
                                text={this.props.accountRS}
                                onCopy={() => 
                                    NotificationManager.success('The account has been copied to clipboard.')
                                }
                            >
                                <a className="user-account-rs">
                                    {this.props.accountRS}
                                </a>
                            </CopyToClipboard>

                            <IconndeButton
                                className={'d-none d-sm-flex text-ellipsis'}
                                id={'open-send-apollo-modal-window'}
                                icon={<i className="zmdi zmdi-alert-circle"/>}
                                text={'Support'}
                                action={'https://support.apollocurrency.com/support/home'}
                                link
                            />

                            <IconndeButton
                                id={'open-send-apollo-modal-window'}
                                icon={<i className="zmdi zmdi-balance-wallet"/>}
                                action={() => setBodyModalParamsAction('SEND_APOLLO')}
                            />

                            <IconndeButton
                                id={'open-settings-window'}
                                icon={<i className="zmdi zmdi stop zmdi-settings"/>}
                                action={() => setBodyModalType('SETTINGS_BODY_MODAL')}
                            />

                            <IconndeButton
                                id={'open-about-apollo'}
                                icon={<i className="zmdi zmdi-help"/>}
                                action={() => setBodyModalParamsAction('GENERAL_INFO')}
                            />

                            {this.props.appState && (
                                <IconndeButton
                                    id={'open-info-apollo'}
                                    icon={<i className="zmdi zmdi-info"/>}
                                    action={() => setBodyModalParamsAction('INFO_NETWORK')}
                                />
                            )}
                            <InputSearchForm ref={this.refSearchInput} onSubmit={this.handleSubmit} />
                        </div>
                    </div>
                    {window.location.pathname === '/dex' && <IconndeButton
                        className={'logout-button'}
                        id={'open-about-apollo'}
                        icon={<i className="zmdi zmdi-power"/>}
                        action={() => setBodyModalParamsAction('LOGOUT_EXCHANGE')}
                    />}
                    <div
                        className="user-box cursor-pointer"
                        onClick={(e) => setBodyModalType('ACCOUNT_BODY_MODAL', e)}
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
        )
    }
}

const mapStateToProps = state => ({
    accountRS: state.account.accountRS,
    appState: state.account.blockchainStatus,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, values) => dispatch(setBodyModalParamsAction(type, values)),
    getTransactionAction: transaction => dispatch(getTransactionAction(transaction)),
    getBlockAction: (data) => dispatch(getBlockAction(data)),
    getAccountInfoAction: (account) => dispatch(getAccountInfoAction(account)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserBox)