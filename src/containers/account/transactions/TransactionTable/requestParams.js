import { TRANSACTION_TYPES } from '../transactionType';

export const getRequestParams = ({
  account,
  type,
  firstIndex,
  lastIndex
}) => {
  return ({
    [TRANSACTION_TYPES.ALL]: {
        account,
        firstIndex,
        lastIndex,
        resultField: 'transactions'
    },
    [TRANSACTION_TYPES[0]]: {
        type,
        account,
        firstIndex,
        lastIndex,
        resultField: 'transactions'
    },
    [TRANSACTION_TYPES[1]]: {
        type,
        account,
        firstIndex,
        lastIndex,
        resultField: 'transactions'
    },
    [TRANSACTION_TYPES[2]]: {
        type,
        account,
        firstIndex,
        lastIndex,
        resultField: 'transactions'
    },
    [TRANSACTION_TYPES[3]]: {
        type,
        account,
        firstIndex,
        lastIndex,
        resultField: 'transactions'
    },
    [TRANSACTION_TYPES[4]]: {
        type,
        account,
        firstIndex,
        lastIndex,
        resultField: 'transactions'
    },
    [TRANSACTION_TYPES[5]]: {
        type,
        account,
        firstIndex,
        lastIndex,
        resultField: 'transactions'
    },
    [TRANSACTION_TYPES[6]]: {
        type,
        account,
        firstIndex,
        lastIndex,
        resultField: 'transactions'
    },
    [TRANSACTION_TYPES[7]]: {
        type,
        account,
        firstIndex,
        lastIndex,
        resultField: 'transactions'
    },
    [TRANSACTION_TYPES[8]]: {
        type,
        account,
        firstIndex,
        lastIndex,
        resultField: 'transactions'
    },
    [TRANSACTION_TYPES.FAILED]: {
        type,
        account,
        failedOnly: true,
        firstIndex,
        lastIndex,
        resultField: 'transactions'
    },
    [TRANSACTION_TYPES.NON_FAILED]: {
        nonFailedOnly: true,
        account,
        firstIndex,
        lastIndex,
        resultField: 'transactions'
    },
    [TRANSACTION_TYPES.UNCONFIRMED_ACCOUNT]: {
        type: null, 
        account, requestType: 'getUnconfirmedTransactions',
        firstIndex,
        lastIndex,
        resultField: 'unconfirmedTransactions',
    },
    [TRANSACTION_TYPES.UNCONFIRMED]: {
        requestType: 'getUnconfirmedTransactions',
        firstIndex,
        lastIndex,
        resultField: 'unconfirmedTransactions',
    },
    [TRANSACTION_TYPES.PHASING]: {
        account,
        requestType: 'getAccountPhasedTransactions',
        firstIndex,
        lastIndex,
        resultField: 'transactions'
    },
  });
}