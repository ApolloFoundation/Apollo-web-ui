/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import { NotificationManager } from 'react-notifications';
import classNames from 'classnames';
import { readFromLocalStorage } from '../../../actions/localStorage';
import { AccountInputBase } from '../form-components/AccountInputBase';

// onChange is a require props
export default function AccountRS(props) {
  const refContactsList = useRef(null);
  const refContactsIcon = useRef(null);

  const {
    onChange, exportAccountList, id, name, value,
    disabled, placeholder, noContactList, qrElement, ...rest
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
      {qrElement && (
        <div  className="input-group-append cursor-pointer">{qrElement}</div>

      )}
      {!noContactList && (
        <div
          className="input-group-append cursor-pointer"
          ref={refContactsIcon}
          onClick={handleContacts}
        >
          <span className="input-group-text"><i className="zmdi zmdi-account-box" /></span>
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
