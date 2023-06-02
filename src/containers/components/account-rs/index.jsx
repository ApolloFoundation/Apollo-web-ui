/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import { NotificationManager } from 'react-notifications';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { MARKETPLACE_REG_EXP } from 'constants/constants';
import { AccountInputBase } from '../form-components/AccountInputBase';
import { ScannerComponents } from '../form-components/ScannerComponent';
import { readFromLocalStorage } from '../../../actions/localStorage';

// onChange is a require props
export default function AccountRS(props) {
  const refContactsList = useRef(null);
  const refContactsIcon = useRef(null);
  const formik = useFormikContext();

  const {
    onChange, exportAccountList, id, name, value,
    disabled, placeholder, noContactList, ...rest
  } = props;

  const [isContacts, setIsContacts] = useState(false);

  const contractString = readFromLocalStorage('APLContacts');

  const contacts = contractString ? JSON.parse(contractString) : [];

  const handleClickOutside = useCallback(event => {
    if (isContacts
    && refContactsList.current && !refContactsList.current.contains(event.target)
    && refContactsIcon.current && !refContactsIcon.current.contains(event.target)) {
      setIsContacts(false);
    }
  }, [isContacts]);

  const handleFillForm = useCallback(account => {
    setIsContacts(false);

    if (onChange) {
      onChange(account);
    }

    if (exportAccountList) {
      exportAccountList(account);
    }
  }, [exportAccountList, onChange]);

  const handleContacts = () => {
    if (contacts && !!contacts.length) {
      setIsContacts(!isContacts);
    } else {
      NotificationManager.info('You have an empty contacts list.', null, 5000);
    }
  };

  const handleChange = (value) => {
    if (exportAccountList) {
      exportAccountList(value);
    }
    onChange(value);
  }

  const handleTextScan = (text) => {
    if (MARKETPLACE_REG_EXP.test(text)) {
        formik.setFieldValue(props.name, text);
    } else {
        NotificationManager.error('Incorrect account value.', 'Error', 5000);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="iconned-input-field">
      <AccountInputBase 
        {...rest}
        onChange={handleChange}
        className="form-control"
        disabled={disabled}
        placeholder={placeholder ?? 'Account ID'}
        id={id}
        name={name}
        value={value}
      />
      {!noContactList && (
        <div
          className="input-group-append cursor-pointer"
          ref={refContactsIcon}
        >
          <span className="input-group-text"><ScannerComponents name={name} onScan={handleTextScan} /></span>
          <span className="input-group-text" onClick={handleContacts}><i className="zmdi zmdi-account-box" /></span>
        </div>
      )}
      {contacts && (
        <div
          ref={refContactsList}
          className={classNames({
            'contacts-list': true,
            active: isContacts,
          })}
        >
          <ul>
            {contacts.map((el) => (
              <li key={el.accountRS}>
                <a onClick={() => handleFillForm(el.accountRS)}>
                  {el.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
