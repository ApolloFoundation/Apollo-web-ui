import React from 'react';
import classNames from 'classnames';
import { FailedType } from '../failedType';

export const TransactionFilter = (props) => {
  const AboveTabeComponentItem = (label, handler, activeCondition) => (
    <div
        className={classNames({
            "btn" : true,
            "filter" : true,
            "active": activeCondition
        })}
        onClick={() => props.handleTransactionFilters(handler, null)}
    >
        {label}
    </div>
  );

  const AboveTabeFailedItems = (label, activeCondition, isFailedOnly) => (
    <div
        className={classNames({
            "btn" : true,
            "filter" : true,
            "active": activeCondition
        })}
        onClick={() => props.handleFailedTransactions(isFailedOnly)}
    >
        {label}
    </div>
  );


  return (
    <div className="transactions-filters">
      <div className="top-bar">
          {AboveTabeComponentItem(
            'All types',
            null,
            !props.failedType && props.type !== 0 && !props.type && !props.subtype && !props.isPhassing && !props.isUnconfirmed
          )}

          {AboveTabeComponentItem(
            <i className="zmdi zmdi-card" />,
            0,
            !props.failedType && props.type === 0 && !props.subtype && !props.isPhassing
          )}
          {AboveTabeComponentItem(
            <i className="zmdi zmdi-email" />,
            1,
            !props.failedType && props.type === 1 && !props.subtype
          )}
          {AboveTabeComponentItem(
            <i className="zmdi zmdi-equalizer" />,
            2,
            !props.failedType && props.type === 2 && !props.subtype
          )}
          {AboveTabeComponentItem(
            <i className="zmdi zmdi-shopping-cart" />,
            3,
            !props.failedType && props.type === 3 && !props.subtype
          )}
          {AboveTabeComponentItem(
            <i className="zmdi zmdi-lock" />,
            4,
            !props.failedType && props.type === 4 && !props.subtype
          )}
          {AboveTabeComponentItem(
            <i className="zmdi zmdi-balance" />,
            5,
            !props.failedType && props.type === 5 && !props.subtype
          )}
          {AboveTabeComponentItem(
            <i className="zmdi zmdi-cloud" />,
            6,
            !props.failedType && props.type === 6 && !props.subtype
          )}
          {AboveTabeComponentItem(
            <i className="zmdi zmdi-shuffle" />,
            7,
            !props.failedType && props.type === 7 && !props.subtype
          )}
          {AboveTabeComponentItem(
            <i className="zmdi zmdi-help" />,
            8,
            !props.failedType && props.type === 8 && !props.subtype
          )}
          
          {AboveTabeFailedItems(
            'Failed', 
            props.failedType === FailedType.FAILED,
            true
          )}
          {AboveTabeFailedItems(
            'Not failed',
            props.failedType === FailedType.NON_FAILED,
            false
          )}


          <div
              className={classNames({
                  "btn" : true,
                  "filter" : true,
                  "active": props.isUnconfirmed && !props.isAll
              })}
              onClick={() => {
                  props.handleTransactionFilters(null, null, 'getUnconfirmedTransactions', false)
              }}
          >
              Unconfirmed (account)
          </div>
          <div
              className={classNames({
                  "btn" : true,
                  "filter" : true,
                  "active": props.isPhassing
              })}
              onClick={() => props.handleTransactionFilters(null, null, 'getAccountPhasedTransactions')}
          >
              Phasing
          </div>
          <div
              className={classNames({
                  "btn" : true,
                  "filter" : true,
                  "active": props.isUnconfirmed && props.isAll
              })}
              onClick={() => props.handleTransactionFilters(null, null, 'getUnconfirmedTransactions', true)}
          >
              All Unconfirmed
          </div>

      </div>
    </div>
  );
}