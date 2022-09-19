/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { formatTimestamp } from '../../../../helpers/util/time';
import { getTransactionAction } from '../../../../actions/transactions';

export default function Transaction(props) {
  const dispatch = useDispatch();

  const { decimals } = useSelector(state => state.account);

  const {
    transaction, timestamp, amountATM, confirmations,
    feeATM, senderRS, attachment, height,
  } = props;

  const getTransactionInfo = useCallback(async currTransaction => {
    const transactionActions = await dispatch(getTransactionAction({
      currTransaction,
      random: Math.random(),
    }));
    return transactionActions;
  }, [dispatch]);

  return (
    <tr>
      <td className="blue-link-text">
        <a onClick={async () => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', await getTransactionInfo(transaction)))}>
          {dispatch(formatTimestamp(timestamp))}
        </a>
      </td>
      <td className="align-right">Ordinary Payment</td>
      <td className="align-right">{amountATM / decimals}</td>
      <td>{feeATM / decimals}</td>
      <td className="blue-link-text align-right">
        <a onClick={() => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', senderRS))}>
          {senderRS}
        </a>
      </td>
      <td>
        {attachment.phasingHolding}
        {' '}
        /
        {' '}
        {attachment.phasingQuorum}
      </td>
      <td>{height}</td>
      <td>{confirmations}</td>
      <td className="">
        <div className="btn-box inline">
          <button
            type="button"
            onClick={() => {
              setBodyModalParamsAction('APPROVE_TRANSACTION', { transaction: props });
            }}
            className="btn btn-default"
          >
            Approve
          </button>
        </div>
      </td>
    </tr>
  );
}
