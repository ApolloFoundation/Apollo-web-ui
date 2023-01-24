import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { formatTimestamp } from '../../../../helpers/util/time';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { numberToLocaleString } from 'helpers/format';

const Entry = ({
  event, eventType, timestamp, change, holdingType,
  holdingInfo, balance, ledgerId,
}) => {
  const dispatch = useDispatch();

  const { decimals } = useSelector(state => state.account);

  return (
    <tr key={uuidv4()}>
      <td className="blue-link-text">
        <a onClick={() => dispatch(setBodyModalParamsAction('INFO_LEDGER_TRANSACTION', ledgerId))}>
          {dispatch(formatTimestamp(timestamp))}
        </a>
      </td>
      <td>
        <a onClick={() => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', event))}>
          {eventType}
        &nbsp;&nbsp;
          <span className="zmdi zmdi-info" />
        </a>
      </td>
      <td className="align-right">
        {holdingType === 'UNCONFIRMED_APL_BALANCE'
        && (change / decimals).toFixed(1)}
      </td>
      <td className="align-right">
        {holdingType === 'UNCONFIRMED_APL_BALANCE' && balance > 0
        && numberToLocaleString(balance / decimals)}
      </td>
      <td className="align-right">
        {holdingInfo && holdingInfo.name}
      </td>
      <td className="align-right">
        {holdingType === 'UNCONFIRMED_CURRENCY_BALANCE'
        && holdingInfo && holdingInfo.name
        && (change / 1).toFixed(2)}
        {holdingType === 'UNCONFIRMED_ASSET_BALANCE'
        && (change / decimals).toFixed(2)}
      </td>
      <td className="align-right">
        {holdingType === 'UNCONFIRMED_CURRENCY_BALANCE'
        && holdingInfo && holdingInfo.name
        && numberToLocaleString(balance)}
        {holdingType === 'UNCONFIRMED_ASSET_BALANCE'
        && numberToLocaleString(balance / decimals)}
      </td>
    </tr>
  );
};

export default Entry;
