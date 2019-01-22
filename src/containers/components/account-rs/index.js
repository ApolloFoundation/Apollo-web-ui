/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import InputMask from 'react-input-mask';
import classNames from 'classnames';
import {NotificationManager} from "react-notifications";
import uuid from "uuid";
import {connect} from 'react-redux';

class AccountRS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prefix: this.props.constants ? this.props.constants.accountPrefix : '',
            contacts: JSON.parse(localStorage.getItem('APLContacts')),
            inputValue: {
                mask: `${this.props.constants ? this.props.constants.accountPrefix : ''}-****-****-****-*****`,
                value: this.props.defaultValue || ''
            },
            isContacts: false,
            isUpdate: false
        };
        if (this.props.setValue) {
            this.props.setValue(this.props.field, this.props.defaultValue);
        }
    };
    componentWillReceiveProps = (newProps) => {
        if (newProps.defaultValue) {
            this.setState({
                inputValue: {
                    mask: 'APL-****-****-****-*****',
                    value: newProps.defaultValue || ''
                },
            })
        }
            
    }
    handleFillForm = (account) => {
        if (this.props.setValue) {
            this.props.setValue(this.props.field, account);            
        }
        this.refs.input.value = account;

        if (this.props.exportAccountList) {
            this.props.exportAccountList(account)
        }

        this.setState({
            isContacts: false,
            inputValue: {
                mask: `${this.props.constants ? this.props.constants.accountPrefix : ''}-****-****-****-*****`,
                value: account
            }
        })
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

    setInputValue = (value) => {
        const newState = {
            mask: `${this.props.constants ? this.props.constants.accountPrefix : ''}-****-****-****-*****`,
            value: value.toUpperCase()
        };

        if (this.props.setValue)
            this.props.setValue(this.props.field, value.indexOf(`${this.props.constants ? this.props.constants.accountPrefix : ''}-`) === -1 ? 'APL-' + value : value);
        
        this.setState({inputValue: newState});

        /* 
         * This peace is needed special for advanced settings 
         * */
        if (this.props.exportAccountList) {
            this.props.exportAccountList(newState.value)
        }
    };

    replaceAll = (search, replace) => {
        return this.split(search).join(replace);
    }

    onChange = (event) => {
        let value;
        const prefix = this.props.constants ? this.props.constants.accountPrefix : '';


        if (event.type === 'paste') {
            value = event.clipboardData.getData('text/plain');

            value = value.replaceAll('\n','');
            
            if (value.includes(`${prefix}-`) && value.indexOf(`${prefix}-`) === 0) {
                if (this.props.onChange && !this.props.noDefaultValue) this.props.onChange(value)
                value = value.replace(`${prefix}-`, '');

                this.setInputValue(value);
            }
        } else {
            value = event.target.value;
            value = value.replace('undefined-', '-')

            if (value.indexOf(`${prefix}-${prefix}`) === -1) {
                this.setInputValue(value);
            }
        }
    };

    render () {
        return (
            <React.Fragment>
                {this.state.inputValue &&
                    <InputMask className="form-control"
                        disabled={this.props.disabled}
                        mask={this.state.inputValue.mask}
                        placeholder={this.props.placeholder || 'Account ID'}
                        ref={'input'}
                        value={this.props.value || this.state.inputValue.value}
                        onPaste={this.onChange}
                        onChange={this.onChange}
                    />
                }
                {!this.props.noContactList &&
                    <a
                        onClick={() => this.handleContacts()}
                        className="input-icon"
                    >
                        <i className="zmdi zmdi-account"/>
                    </a>
                }
                {this.state.contacts &&
                    <div
                        className={classNames({
                            'contacts-list': true,
                            'active': this.state.isContacts
                        })}
                    >
                        <ul>
                            {
                                this.state.contacts.map((el, index) => {
                                    return (
                                        <li key={uuid()}>
                                            <a onClick={() => this.handleFillForm(el.accountRS)}>
                                                {el.name}
                                            </a>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    constants: state.account.constants
})

export default connect(mapStateToProps)(AccountRS) ;