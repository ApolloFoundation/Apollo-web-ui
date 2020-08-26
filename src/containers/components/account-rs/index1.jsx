/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import { useField } from 'formik';
import { NotificationManager } from 'react-notifications';
import classNames from 'classnames';
import InputMask from 'react-input-mask';

export default function AccountRS(props) {
  const refContactsList = useRef(null);
  const refContactsIcon = useRef(null);

  const {
    onChange, exportAccountList, id, name,
    disabled, placeholder, noContactList,
  } = props;

  const { ticker } = useSelector(state => state.account);

  const [field, , helpers] = useField(name);

  const [isContacts, setIsContacts] = useState(false);

  const contacts = JSON.parse(localStorage.getItem('APLContacts'));

  const { setValue } = helpers;

  const handleClickOutside = useCallback(event => {
    if (isContacts
    && refContactsList.current && !refContactsList.current.contains(event.target)
    && refContactsIcon.current && !refContactsIcon.current.contains(event.target)) {
      setIsContacts(false);
    }
  }, [isContacts]);

  const handleFillForm = useCallback(account => {
    setIsContacts(false);

    if (setValue) {
      setValue(account);
    }

    if (exportAccountList) {
      exportAccountList(account);
    }
  }, [exportAccountList, setValue]);

  const handleContacts = () => {
    if (contacts && !!contacts.length) {
      setIsContacts(!isContacts);
    } else {
      NotificationManager.info('You have an empty contacts list.', null, 5000);
    }
  };

  const handleChange = ({ target: { value } }) => {
    if (setValue) {
      setValue(value);
    }

    if (exportAccountList) {
      exportAccountList(value);
    }

    if (onChange) onChange(value);
  };

  const handleBeforeMaskedValueChange = (newState, oldState, userInput) => {
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

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      <InputMask
        {...field}
        className="form-control"
        disabled={disabled}
        mask={`${ticker}-****-****-****-*****`}
        placeholder={placeholder || 'Account ID'}
        onChange={handleChange}
        beforeMaskedValueChange={handleBeforeMaskedValueChange}
        id={id}
      />
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
            {contacts.map((el, index) => (
              <li key={index}>
                <a onClick={() => handleFillForm(el.accountRS)}>
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
