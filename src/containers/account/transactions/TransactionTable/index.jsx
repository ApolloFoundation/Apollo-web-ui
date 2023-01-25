import React, { useCallback, useEffect, useRef, useState, useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {NotificationManager} from "react-notifications";
import { useLocation } from 'react-router-dom';
import {getTransactionsAction } from "../../../../actions/transactions";
import { getAccountSelector, getPassPhraseSelector } from '../../../../selectors';
import { TableLoader } from '../../../components/TableLoader';
import Transaction from '../transaction'
import cancelAxiosRequest from '../../../../helpers/cancelToken';
import { getRequestParams } from './requestParams';

// There is table for transactions and data loading logic
export const TransactionTable = (props) => {
  const { search } = useLocation();
  const ref = useRef({
    showPrivateOnce: true,
  })
  const dispatch = useDispatch();
  const [isResetPagination, setIsResetPagination] = useState(false);
  const account = useSelector(getAccountSelector);
  const passPhrase = useSelector(getPassPhraseSelector);

  const type = useMemo(() => new URLSearchParams(search).get('type'), [search]);

  const handleRequest = useCallback(async ({ firstIndex, lastIndex }) => {
    try {
        const request = getRequestParams({ account, type, firstIndex, lastIndex });
        const { resultField, ...params } = request[type];
    
        if (props.isPrivate) {
            params.secretPhrase = passPhrase;
        }
    
        const transactions = await dispatch(getTransactionsAction(params));
    
        if (!transactions) return null
    
        if (transactions.errorCode) {
            NotificationManager.error(transactions.errorDescription, 'Error', 900000);
            return [];
        }
    
        if (transactions.serverPublicKey && !props.isPrivate) {
            props.onPrivateTransaction();
        }

        if (transactions.serverPublicKey && ref.current.showPrivateOnce) {
            NotificationManager.success('You are watching private transactions.', null, 900000);
            ref.current.showPrivateOnce = false;
        }
        return transactions[resultField] || [];
    } catch(e) {
        NotificationManager.error('Error', 'Error', 900000);
        return null;
    }
  }, [dispatch, account, type, props.isPrivate, passPhrase, props.onPrivateTransaction]);

  const handleResetPagination = useCallback(() => {
    setIsResetPagination(false);
  }, []);

  useEffect(() => {
    setIsResetPagination(true);
    cancelAxiosRequest.cancelRequests();
  }, [type]);

  return (
    <TableLoader
      headersList={[
          {
              name: 'Date',
              alignRight: false
          },{
              name: 'Type',
              alignRight: false
          },{
              name: 'Amount',
              alignRight: true
          },{
              name: 'Fee',
              alignRight: true
          },{
              name: 'Account',
              alignRight: false
          },{
              name: 'Phasing',
              alignRight: true
          },{
              name: 'Height',
              alignRight: true
          },{
              name: 'Confirmations',
              alignRight: true
          }
      ]}
      // keyField={'ledgerId'}
      className={'no-min-height mb-3'}
      emptyMessage={'No transactions found.'}
      TableRowComponent={Transaction}
      passProps={{
          secretPhrase: passPhrase,
          isUnconfirmed: type === 'unconfirmed' || type === 'unconfirmedAccount',
      }}
      dataLoaderCallback={handleRequest}
      isResetPagination={isResetPagination}
      onResetPagination={handleResetPagination}
  />
  );
}