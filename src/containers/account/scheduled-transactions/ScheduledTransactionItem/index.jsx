import React from 'react';
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {NotificationManager} from "react-notifications";
import { useFormatTimestamp } from "hooks/useFormatTimestamp";
import { setBodyModalParamsAction } from "modules/modals";
import { getAccountInfoSelector } from "selectors";
import { getBlockAction } from 'actions/blocks';
import { formatTransactionType } from 'actions/transactions';
import { bigIntDivision, bigIntFormat } from 'helpers/util/bigNumberWrappers';

export const ScheduledTransactionItem = (props) => {
  const dispatch = useDispatch();
  const { decimals, constants } = useSelector(getAccountInfoSelector, shallowEqual);
  const handleTime = useFormatTimestamp();

  const handleINfoTransactionModal = () => 
    dispatch(setBodyModalParamsAction('INFO_TRANSACTION', props.transaction));

  const handleInfoAccountModal = () =>
    dispatch(setBodyModalParamsAction('INFO_ACCOUNT', props.senderRS));

  const getBlock = async () => {
    const block = await dispatch(getBlockAction({ height: props.height }));

    if (block) {
      dispatch(setBodyModalParamsAction('INFO_BLOCK', block));
    } else {
      NotificationManager.error('Request error!', 'Error', 5000);
    }
  }

  const transactionType = constants.transactionTypes && constants.transactionTypes[props.type];

  return (
    <tr>
      <td>
        <span
          className="blue-link-text"
          onClick={handleINfoTransactionModal}
        >
          {handleTime(props.timestamp)}
        </span>
      </td>
      <td>
        {!!transactionType && (
          (transactionType.subtypes[props.subtype].name === 'AliasSell' && props.amountATM === '0' && props.attachment.priceATM === '0')
            ? formatTransactionType('AliasTransfer')
            : formatTransactionType(transactionType.subtypes[props.subtype].name)
        )}
      </td>
      <td className="align-right">
        {
          (props.amountATM === '0' && props.attachment.priceATM && props.attachment.priceATM !== '0')
            ? bigIntFormat(bigIntDivision(props.attachment.priceATM, decimals))
            : bigIntFormat(bigIntDivision(props.amountATM, decimals))
        }
      </td>
      <td className="align-right">{bigIntFormat(bigIntDivision(props.feeATM, decimals))}</td>
      <td>
        <span className="blue-link-text" onClick={handleInfoAccountModal}>
          {props.senderRS}
        </span>
      </td>
      <td className="align-right">
        <span className="blue-link-text" onClick={getBlock}>{props.height}</span>
      </td>
      <td className="align-right">
        <button
          type='button'
          className="btn btn-default mt-0"
          onClick={props.deleteSheduledTransaction(props.transaction)}
        >
          Delete
        </button>
      </td>
    </tr>
  )
}
