/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import { secureStorage } from '../helpers/format';
import { getCookie, removeCookie, setCookie } from './cookie';

export function writeToLocalStorage(field, params) {
  secureStorage.setItem(field, JSON.stringify(params));
  if (field === 'APLUserRS') {
    setCookie(field, params);
  }
}

export function readFromLocalStorage(field) {
  if (field === 'updateFlag' || field === 'language') {
    return secureStorage.getItem(field);
  }

  try {
    let value = secureStorage.getItem(field);
    let cookieValue
    let checkValue
    if (field === 'APLUserRS') {
      cookieValue = getCookie(field);
      checkValue = value ? (!!cookieValue && cookieValue !== JSON.parse(value)) : !!cookieValue
    }
    if (!value && !cookieValue) return value;
    if (checkValue) {
      secureStorage.clear();
      writeToLocalStorage(field, cookieValue);
      value = JSON.stringify(cookieValue);
    }
    const parsedValue = JSON.parse(value);
    if (field === 'APLContracts' && !Array.isArray(parsedValue)) {
      throw new Error()
    }
    if(field === 'Wallets' && typeof parsedValue !== 'object') {
      throw new Error()
    }
    return value;
  } catch (e) {
    clearLocalStorage();
    return null;
  }
}

export function clearLocalStorage() {
  secureStorage.clear();
  removeCookie('APLUserRS');
}

export function deleteFromLocalStorage(field) {
  secureStorage.removeItem(field);
  if (field === 'APLUserRS') {
    removeCookie(field);
  }
}

export function setJSONItem(key, data) {
  const jsonData = JSON.stringify(data);
  secureStorage.setItem(key, jsonData);
  if (key === 'APLUserRS') {
    setCookie(key, jsonData);
  }
}

function getAccountKey(key) {
  return (dispatch, getState) => {
    const { account } = getState();

    if (account.account === '') {
      return key;
    }
    return `${key}.${account.account}`;
  };
}

export function setAccountJSONItem(key, data) {
  setJSONItem(getAccountKey(key), data);
}

function getJSONItem(key) {
  return JSON.parse(secureStorage.getItem(key));
}

export function getAccountJSONItem(key) {
  return dispatch => dispatch(getJSONItem(getAccountKey(key)));
}

export function storageSelect(table, query, callback) {
  return (dispatch, getState) => {

    const items = dispatch(getAccountJSONItem(table));

    if (!items) {
      if (callback) {
        callback('No items to select', []);
      }
      return;
    }
    const response = [];
    for (let i = 0; i < items.length; i++) {
      if (!query || query.length === 0) {
        response.push(items[i]);
        continue;
      }
      for (let j = 0; j < query.length; j++) {
        Object.keys(query[j]).forEach(key => {
          if (items[i][key] === query[j][key]) {
            response.push(items[i]);
          }
        });
      }
    }
    if (callback) {
      callback(null, response);
    }
  };
}

export function storageInsert(table, key, data, callback, isAutoIncrement) {
  return dispatch => {
    let items = dispatch(getAccountJSONItem(table));
    if (!items) {
      items = [];
    }
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (items[i][key] === data[j][key]) {
          if (callback) {
            callback(`Key already exists: ${items[i][key]}`, []);
          }
          return;
        }
      }
    }

    function insertItem(item) {
      const currentItem = item;
      if (!isAutoIncrement) {
        items.push(currentItem);
        return;
      }
      if (currentItem.id) {
        if (callback) {
          callback('Cannot use auto increment id since data already contains id value', []);
        }
        return;
      }
      if (items.length === 0) {
        currentItem.id = 1;
      } else {
        currentItem.id = items[items.length - 1].id + 1;
      }
      items.push(currentItem);
    }

    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        insertItem(data[i]);
      }
    } else {
      insertItem(data);
    }
    setAccountJSONItem(table, items);
    if (callback) {
      callback(null, items);
    }
  };
}
