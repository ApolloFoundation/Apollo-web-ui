/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import InputMask from 'react-input-mask';
import classNames from 'classnames';
import {NotificationManager} from 'react-notifications';
import {connect} from 'react-redux';

class AccountRS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prefix: 'APL',
            contacts: JSON.parse(localStorage.getItem('APLContacts')),
            value: this.props.defaultValue || '',
            isContacts: false,
            isUpdate: false
        };
        if (this.props.setValue) {
            this.props.setValue(this.props.field, this.props.defaultValue);
        }
    };

    handleFillForm = (account) => {
        this.setState({
            isContacts: false,
            value: account
        });

        if (this.props.setValue) {
            this.props.setValue(this.props.field, account);
        }

        if (this.props.exportAccountList) {
            this.props.exportAccountList(account)
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

    onChange = (event) => {
        const account = event.target.value;
        this.setState({
            value: account
        });

        if (this.props.setValue) {
            this.props.setValue(this.props.field, account);
        }

        if (this.props.exportAccountList) {
            this.props.exportAccountList(account)
        }
    };

    handleBeforeMaskedValueChange = (newState, oldState, userInput) => {
        let value = newState.value.toUpperCase();
        if (userInput) {
            if (value.startsWith('APL-APL') && userInput.startsWith('APL-') && userInput.length === 24) {
                value = userInput;
            }
        }
        return {value, selection: newState.selection};
    };

    render() {
        return (
            <React.Fragment>
                <InputMask className="form-control"
                           disabled={this.props.disabled}
                           mask={'APL-****-****-****-*****'}
                           placeholder={this.props.placeholder || 'Account ID'}
                           ref={'input'}
                           value={this.state.value}
                           onChange={this.onChange}
                           beforeMaskedValueChange={this.handleBeforeMaskedValueChange}
                           id={this.props.id}
                />
                {!this.props.noContactList && (
                    <a
                        onClick={() => this.handleContacts()}
                        className="input-icon"
                    >
                        <i className="zmdi zmdi-account-box"/>
                    </a>
                )}
                {this.state.contacts && (
                    <div
                        className={classNames({
                            'contacts-list': true,
                            'active': this.state.isContacts
                        })}
                    >
                        <ul>
                            {this.state.contacts.map((el, index) => (
                                <li key={index}>
                                    <a onClick={() => this.handleFillForm(el.accountRS)}>
                                        {el.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    constants: state.account.constants
});

export default connect(mapStateToProps)(AccountRS);