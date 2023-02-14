import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import classNames from 'classnames';
import { readFromLocalStorage } from 'actions/localStorage';
import {switchAccountAction} from "actions/account";
import styles from './index.module.scss';

export const ContactsList = () => {
  const dispatch = useDispatch();
  const ref = useRef();
  const refButton = useRef();
  const history = useHistory();
  const [contacts, setContacts] = useState(null);
  const [isContacts, setIsContacts] = useState(false);
  
  const handleClickOutside = useCallback((event) => {
    if (isContacts && ref && !ref.current.contains(event.target) 
        && refButton && !refButton.current.contains(event.target)) {
            setIsContacts(false);
    }
  }, [isContacts, ref]);

  const handleContacts = () => {
    if (contacts && contacts.length) {
        setIsContacts(true);
        return;
    }

    NotificationManager.info('You have an empty contacts list.', null, 5000)
  };

  const handleContactClick = (accountRS) => () => {
    dispatch(switchAccountAction(accountRS, history))
  }

  useEffect(() => {
      try {
          const contactList = readFromLocalStorage('APLContacts');
          if(contactList) {
              setContacts(JSON.parse(contactList))
          }
      } catch(err) {
          console.error(err);
      }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [handleClickOutside]);

  return (
    <>
      <div className="col-xc-12 col-md-6">
          <button
              ref={refButton}
              type='button'
              onClick={handleContacts}
              className="btn btn-default block"
          >
              Switch account
          </button>
      </div>
      {contacts && (
        <div
          ref={ref}
          className={classNames('contacts-list', styles.contactItem, {
              'active': isContacts
          })}
        >
          <ul>
              {contacts?.length &&
                  contacts.map((el) => (
                    <li>
                        <a onClick={handleContactClick(el.accountRS)}>
                            {el.name}
                        </a>
                    </li>
                ))
              }
          </ul>
        </div>
      )}
    </>
  );
}