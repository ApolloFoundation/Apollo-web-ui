import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatTimestamp } from '../../../../helpers/util/time';
import { setBodyModalParamsAction } from '../../../../modules/modals';

const Entry = ({
  event, eventType, timestamp, change, holdingType,
  holdingInfo, balance, ledgerId,
}) => {
  const dispatch = useDispatch();

  const { decimals } = useSelector(state => state.account);

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
        && (change / decimals).toFixed(1)}
      </td>
      <td className="align-right">
        {holdingType === 'UNCONFIRMED_APL_BALANCE' && balance > 0
        && (balance / decimals).toLocaleString('en')}
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
        && (balance / 1).toLocaleString('en')}
        {holdingType === 'UNCONFIRMED_ASSET_BALANCE'
        && (balance / decimals).toLocaleString('en')}
      </td>
    </tr>
  );
};

export default Entry;
