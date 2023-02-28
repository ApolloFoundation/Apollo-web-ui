import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDecimalsSelector } from 'selectors';
import { formatTimestamp } from 'helpers/util/time';
import { setBodyModalParamsAction } from 'modules/modals';
import { numberToLocaleString } from 'helpers/format';
import { bigIntDivision, bigIntFormat } from 'helpers/util/bigNumberWrappers';

const Entry = ({
  event, eventType, timestamp, change, holdingType,
  holdingInfo, balance, ledgerId,
}) => {
  const dispatch = useDispatch();

  const decimals = useSelector(getDecimalsSelector);

  const handleOpenLedgetModal = () =>
    dispatch(setBodyModalParamsAction('INFO_LEDGER_TRANSACTION', { ledgerId }));

  const handleOpenInfoTransaction = () =>
    dispatch(setBodyModalParamsAction('INFO_TRANSACTION', event)); 

  return (
    <tr>
      <td className="blue-link-text">
        <a onClick={handleOpenLedgetModal}>
          {dispatch(formatTimestamp(timestamp))}
        </a>
      </td>
      <td>
        <a onClick={handleOpenInfoTransaction}>
          {eventType}
        &nbsp;&nbsp;
          <span className="zmdi zmdi-info" />
        </a>
      </td>
      <td className="align-right">
        {holdingType === 'UNCONFIRMED_APL_BALANCE'
        && numberToLocaleString(bigIntFormat(bigIntDivision(change, decimals)), {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}
      </td>
      <td className="align-right">
        {holdingType === 'UNCONFIRMED_APL_BALANCE' && balance > 0
        && numberToLocaleString(bigIntFormat(bigIntDivision(balance, decimals)))}
      </td>
      <td className="align-right">
        {holdingInfo && holdingInfo.name}
      </td>
      <td className="align-right">
        {holdingType === 'UNCONFIRMED_CURRENCY_BALANCE'
        && holdingInfo && holdingInfo.name
        && (change / 1).toFixed(2)}
        {holdingType === 'UNCONFIRMED_ASSET_BALANCE'
        && numberToLocaleString(bigIntFormat(bigIntDivision(change, decimals)), {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
      <td className="align-right">
        {holdingType === 'UNCONFIRMED_CURRENCY_BALANCE'
        && holdingInfo && holdingInfo.name
        && numberToLocaleString(balance)}
        {holdingType === 'UNCONFIRMED_ASSET_BALANCE'
        && numberToLocaleString(bigIntFormat(bigIntDivision(balance, decimals)))}
      </td>
    </tr>
  );
};

export default Entry;
