import React, {Component} from 'react';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import {Form, Text} from 'react-form';
import {NotificationManager} from "react-notifications";
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../../modules/modals';

import IconndeButton from '../iconned-button';
import CurrentAccountIcon from '../current-account/current-account-icon';
import MobieMenu from '../mobile-menu/';
import {CopyToClipboard} from 'react-copy-to-clipboard';


import Settings from '../settings';
import SettingsIcon from '../settings/settings-icon';


class UserBox extends Component {
    state = {};

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

    handleSearchind = async (values) => {
        if (!this.state.isSearching) {
            this.setState({
                isSearching: true
            });

            const transaction = this.props.getTransactionAction({transaction: values.value});
            const block = this.props.getBlockAction({block: values.value});
            const account = this.props.getAccountInfoAction({account: values.value});
            this.props.setBodyModalParamsAction(null);

            Promise.all([transaction, block, account])
                .then((data) => {
                    const transaction = data[0];
                    const block       = data[1];
                    const account     = data[2];

                    const modals = ['INFO_TRANSACTION', 'INFO_BLOCK', 'INFO_ACCOUNT'];

                    const result = [transaction, block, account].find((el, index) => {
                        if (el) {
                            if (index < 2) {
                                this.props.setBodyModalParamsAction(modals[index], el);
                                return el
                            } else {
                                if (el.account) {
                                    this.props.setBodyModalParamsAction(modals[index], el.account);
                                    return el
                                }
                            }
                        }
                    });

                    if (!result) {
                        NotificationManager.error('Invalid search properties.', null, 5000);
                    }

                    this.setState({
                        isSearching: false
                    })

                });
        }
    };

    
    render () {
        const {setBodyModalType, setBodyModalParamsAction, menuShow, showMenu, closeMenu} = this.props;

        return (
            (
                <div className={classNames({
                    "user-search-box": true,
                    "searching": this.state.searching
                })}>
                    {/*TODO : fix site header search animation*/}
                    <Link className="logo" to={"/"}>
                        <img src="https://apollowallet.org/apollo-logo.svg"/>
                    </Link>
                    <div 
                        className={`burger-mobile ${menuShow ? "menu-open" : ""}`}
                        onClick={showMenu}
                    >
                        <div className="line"/>
                    </div>
                    <div className={`mobile-nav ${menuShow ? "show" : ""}`}>
                        <MobieMenu closeMenu={closeMenu}/>
                    </div>
                    <div
                        className={classNames({
                            'search-bar': true,
                        })}
                    >
            
                        <Form
                            onSubmit={values => this.handleSearchind(values)}
                            render={({submitForm, getFormState}) => (
                                <form onSubmit={submitForm}>
                                    <Text
                                        field={'value'}
                                        onMouseOut={this.resetSearchStateToActive}
                                        onMouseDown={this.setSearchStateToActive}
                                        onMouseOver={this.setSearchStateToActive}
                                        className={"searching-window"}
                                        type="text"
                                        placeholder="Enter Transaction/Account ID/Block ID"
                                    />
            
            
                                    <div className="user-account-actions">
                                        <CopyToClipboard
                                            text={this.props.accountRS}
                                            onCopy={() => {
                                                NotificationManager.success('The account has been copied to clipboard.')
                                            }}
                                        >
                                            <a
                                                className="user-account-rs"
                                            >
                                                {this.props.accountRS}
                                            </a>
                                        </CopyToClipboard>
            
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
                                        {
                                            window.innerWidth > 768 && 
                                            <IconndeButton
                                                id={'open-search-transaction'}          
                                                icon={<i className="zmdi zmdi-search"/>}             
                                                action={() => this.setSearchStateToActive(getFormState().values)}
                                            />
                                        }
                                        
                                    </div>
                                </form>
                            )}
                        />
            
                    </div>
                    <div className="user-box"
                         onClick={(e) => setBodyModalType('ACCOUNT_BODY_MODAL', e)}
                    >
                        <CurrentAccountIcon />
                        
                    </div>
                </div>   
            )
        )
    }
}

const mapStateToProps = state => ({
    accountRS: state.account.accountRS,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, values) => dispatch(setBodyModalParamsAction(type, values))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserBox)