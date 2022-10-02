/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setBodyModalParamsAction } from '../../../../../modules/modals';
import { getDecimalsSelector } from 'selectors';
import { useFormatTimestamp } from '../../../../../hooks/useFormatTimestamp';

export default function TradeHistoryItem(props) {
  const dispatch = useDispatch();
  const decimals = useSelector(getDecimalsSelector);
  const handleTime = useFormatTimestamp();

  const handleTransactionInfo = (data) => () =>
    dispatch(setBodyModalParamsAction('INFO_TRANSACTION', data));

  const handleInfoAccountModal = (data) => () =>
    dispatch(setBodyModalParamsAction('INFO_ACCOUNT', data));

  if (props) {
    return (
      <tr>
        <td>{handleTime(props.timestamp)}</td>
        <td>
          <span className="blue-link-text" onClick={handleTransactionInfo(props.transaction)}>
            {props.transaction}
          </span>
        </td>
        <td>
          <span className="blue-link-text" onClick={handleTransactionInfo(props.offer)} >
            {props.offer}
          </span>
        </td>
        <td className="blue-link-text">
          <Link to={`/exchange-booth/${props.code || ''}`}>
            {props.code}
          </Link>
        </td>
        <td>
          <span className="blue-link-text" onClick={handleInfoAccountModal(props.seller)}>
            {props.sellerRS}
          </span>
        </td>
        <td>
          <span className="blue-link-text" onClick={handleInfoAccountModal(props.buyer)}>
            {props.buyerRS}
          </span>
        </td>
        <td className="align-right">
          {(props.units / (10 ** props.decimals)).toFixed(2)}
        </td>
        <td className="align-right">
          {parseFloat(props.rateATM).toLocaleString('en')}
        </td>
        <td className="align-right">
          {((props.units * props.rateATM) / decimals).toLocaleString('ru', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td>
      </tr>
    );
  }

  return (
    <tr />
  );
}
