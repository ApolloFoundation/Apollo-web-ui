/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */


import React from 'react';
import InputMask from 'react-input-mask';
import classNames from 'classnames';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { MARKETPLACE_REG_EXP } from 'constants/constants';
import { readFromLocalStorage } from '../../../actions/localStorage';
import { ScannerComponents } from '../form-components/ScannerComponents';

class AccountRS extends React.Component {
  refContactsList = React.createRef();

  refContactsIcon = React.createRef();

  constructor(props) {
    super(props);
    const contractString = readFromLocalStorage('APLContacts');
    this.state = {
      prefix: 'APL',
      contacts: contractString ? JSON.parse(contractString) : [],
      value: this.props.defaultValue || '',
      isContacts: false,
      isUpdate: false,
      defaultValue: this.props.defaultValue,
    };
    if (this.props.setValue) {
      this.props.setValue(this.props.field, this.props.defaultValue);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.defaultValue !== state.defaultValue) {
      return {
        defaultValue: props.defaultValue,
        value: props.defaultValue,
      };
    }

    if (props.value !== state.value) {
      return {
        defaultValue: props.defaultValue,
        value: props.value,
      };
    }

    return null;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleFillForm = account => {
    this.setState({
      isContacts: false,
      value: account,
    });

    if (this.props.setValue) {
      this.props.setValue(this.props.field, account);
    }

    if (this.props.exportAccountList) {
      this.props.exportAccountList(account);
    }
  };

    setWrapperContactsIconRef = node => {
      this.refContactsIcon = node;
    };

    setWrapperContactsRef = node => {
      this.refContactsList = node;
    };

    handleClickOutside = event => {
      if (this.state.isContacts
            && this.refContactsList && !this.refContactsList.contains(event.target)
            && this.refContactsIcon && !this.refContactsIcon.contains(event.target)) {
        this.setState({ isContacts: false });
      }
    };

    handleContacts = () => {
      if (this.state.contacts && !!this.state.contacts.length) {
        this.setState({ isContacts: !this.state.isContacts });
      } else {
        NotificationManager.info('You have an empty contacts list.', null, 5000);
      }
    };

    onChange = event => {
      const account = event.target.value;
      this.setState({ value: account });

      if (this.props.setValue) {
        this.props.setValue(this.props.field, account);
      }

      if (this.props.exportAccountList) {
        this.props.exportAccountList(account);
      }
    };

    handleBeforeMaskedValueChange = (newState, oldState, userInput) => {
      let value = newState.value.toUpperCase();
      if (userInput) {
        if ((value.startsWith('APL-APL') || value.startsWith('USDS-USDS'))
          && (userInput.startsWith('APL-') || userInput.startsWith('USDS-'))
          && userInput.length === 24
        ) {
          value = userInput;
        }
      }
      return { value, selection: newState.selection };
    };


    handleTextScan = (text) => {
      if (MARKETPLACE_REG_EXP.test(text)) {
        this.props.setValue(this.props.field, text);
      } else {
        NotificationManager.error('Incorrect account value.', 'Error', 5000);
      }
    } 

    render() {
      return (
        <>
          <InputMask
            className="form-control"
            disabled={this.props.disabled}
            mask={`${this.props.ticker}-****-****-****-*****`}
            placeholder={this.props.placeholder || 'Account ID'}
            ref="input"
            value={this.state.value}
            onChange={this.onChange}
            beforeMaskedValueChange={this.handleBeforeMaskedValueChange}
            id={this.props.id}
          />
          {(window.cordova && window.QRScanner) && (
            <span className="input-group-text">
              <ScannerComponents name={this.props.field} onScan={this.handleTextScan} />
            </span>
          )}
          {!this.props.noContactList && (
            <div
              className="input-group-append cursor-pointer"
              ref={this.setWrapperContactsIconRef}
              onClick={() => this.handleContacts()}
            >
              <span className="input-group-text"><i className="zmdi zmdi-account-box" /></span>
            </div>
          )}
          {this.state.contacts && (
            <div
              ref={this.setWrapperContactsRef}
              className={classNames({
                'contacts-list': true,
                active: this.state.isContacts,
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
        </>
      );
    }
}

const mapStateToProps = state => ({
  constants: state.account.constants,
  ticker: state.account.ticker,
});

export default connect(mapStateToProps)(AccountRS);
