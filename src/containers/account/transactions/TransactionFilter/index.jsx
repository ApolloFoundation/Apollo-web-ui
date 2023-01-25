import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { TRANSACTION_TYPES } from '../transactionType';

export const TransactionFilter = () => {
  const { search } = useLocation();
  const type = useMemo(() => new URLSearchParams(search).get('type'), [search]);

  const AboveTabeComponentItem = (label, handler) => (
    <Link
        className={classNames({
            "btn" : true,
            "filter" : true,
            "active": type === handler,
        })}
        to={`/transactions?type=${handler}`}
    >
        {label}
    </Link>
  );

  const AboveTabeFailedItems = (label, activeCondition, isFailedOnly) => (
    <Link
        className={classNames({
            "btn" : true,
            "filter" : true,
            "active": activeCondition
        })}
        to={`/transactions?type=${isFailedOnly ? TRANSACTION_TYPES.FAILED : TRANSACTION_TYPES.NON_FAILED}`}
    >
        {label}
    </Link>
  );

  return (
    <div className="transactions-filters">
      <div className="top-bar">
          {AboveTabeComponentItem( 'All types', TRANSACTION_TYPES.ALL)}
          {AboveTabeComponentItem( <i className="zmdi zmdi-card" />, TRANSACTION_TYPES[0])}
          {AboveTabeComponentItem( <i className="zmdi zmdi-email" />, TRANSACTION_TYPES[1])}
          {AboveTabeComponentItem( <i className="zmdi zmdi-equalizer" />, TRANSACTION_TYPES[2])}
          {AboveTabeComponentItem( <i className="zmdi zmdi-shopping-cart" />, TRANSACTION_TYPES[3])}
          {AboveTabeComponentItem( <i className="zmdi zmdi-lock" />, TRANSACTION_TYPES[4])}
          {AboveTabeComponentItem( <i className="zmdi zmdi-balance" />, TRANSACTION_TYPES[5])}
          {AboveTabeComponentItem( <i className="zmdi zmdi-cloud" />, TRANSACTION_TYPES[6])}
          {AboveTabeComponentItem( <i className="zmdi zmdi-shuffle" />, TRANSACTION_TYPES[7])}
          {AboveTabeComponentItem( <i className="zmdi zmdi-help" />, TRANSACTION_TYPES[8])}
          
          {AboveTabeFailedItems(
            'Failed', 
            type === TRANSACTION_TYPES.FAILED,
            true
          )}
          {AboveTabeFailedItems(
            'Not failed',
            type === TRANSACTION_TYPES.NON_FAILED,
            false
          )}
          <Link
              className={classNames({
                  "btn" : true,
                  "filter" : true,
                  "active": type === TRANSACTION_TYPES.UNCONFIRMED_ACCOUNT,
              })}
              to={`/transactions?type=${TRANSACTION_TYPES.UNCONFIRMED_ACCOUNT}`}
          >
              Unconfirmed (account)
          </Link>
          <Link
              className={classNames({
                  "btn" : true,
                  "filter" : true,
                  "active": type === TRANSACTION_TYPES.PHASING,
              })}
              to={`/transactions?type=${TRANSACTION_TYPES.PHASING}`}
          >
              Phasing
          </Link>
          <Link
              className={classNames({
                  "btn" : true,
                  "filter" : true,
                  "active": type === TRANSACTION_TYPES.UNCONFIRMED,
              })}
              to={`/transactions?type=${TRANSACTION_TYPES.UNCONFIRMED}`}
          >
              All Unconfirmed
          </Link>
      </div>
    </div>
  );
}