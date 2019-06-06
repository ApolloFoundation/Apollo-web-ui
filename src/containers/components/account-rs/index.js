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
    refContactsList = React.createRef();
    refContactsIcon = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            prefix: 'APL',
            contacts: JSON.parse(localStorage.getItem('APLContacts')),
            value: this.props.defaultValue || '',
            isContacts: false,
            isUpdate: false,
            defaultValue: this.props.defaultValue,
        };
        if (this.props.setValue) {
            this.props.setValue(this.props.field, this.props.defaultValue);
        }
    };

    static getDerivedStateFromProps(props, state) {
        if (props.defaultValue !== state.defaultValue) {
            return {
                defaultValue: props.defaultValue,
                value: props.defaultValue
            };
        }

        return null;
    }

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

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperContactsIconRef = (node) => {
        this.refContactsIcon = node;
    };

    setWrapperContactsRef = (node) => {
        this.refContactsList = node;
    };

    handleClickOutside = (event) => {
        if (this.refContactsList && !this.refContactsList.contains(event.target) &&
        this.refContactsIcon &&  !this.refContactsIcon.contains(event.target)) {
            this.setState({
                isContacts: false
            })
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
                    <div className="input-group-append cursor-pointer"
                         ref={this.setWrapperContactsIconRef}
                         onClick={() => this.handleContacts()}>
                        <span className="input-group-text"><i className="zmdi zmdi-account-box"/></span>
                    </div>
                )}
                {this.state.contacts && (
                    <div
                        ref={this.setWrapperContactsRef}
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