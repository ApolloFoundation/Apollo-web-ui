/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { getTransactionAction } from '../../../../actions/transactions';
import { getDecimalsSelector } from '../../../../selectors';
import { useFormatTimestamp } from '../../../../hooks/useFormatTimestamp';

export default function Transaction(props) {
  const dispatch = useDispatch();
  const decimals = useSelector(getDecimalsSelector);
  const handleTime = useFormatTimestamp();

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

  const handleInfoTransactionModal = async () =>
    dispatch(setBodyModalParamsAction('INFO_TRANSACTION', await getTransactionInfo(transaction)));

  const handleInfoAccountModal = () => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', senderRS));

  const handleApproveTransaction = dispatch(setBodyModalParamsAction('APPROVE_TRANSACTION', { transaction: props }));

  return (
    <tr>
      <td className="blue-link-text">
        <a onClick={handleInfoTransactionModal}>
          {handleTime(timestamp)}
        </a>
      </td>
      <td className="align-right">Ordinary Payment</td>
      <td className="align-right">{amountATM / decimals}</td>
      <td>{feeATM / decimals}</td>
      <td className="blue-link-text align-right">
        <a onClick={handleInfoAccountModal}>
          {senderRS}
        </a>
      </td>
      <td>{`${attachment.phasingHolding} / ${attachment.phasingQuorum}`}</td>
      <td>{height}</td>
      <td>{confirmations}</td>
      <td>
        <div className="btn-box inline">
          <button
            type="button"
            onClick={handleApproveTransaction}
            className="btn btn-default"
          >
            Approve
          </button>
        </div>
      </td>
    </tr>
  );
}
