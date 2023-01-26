/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import i18n from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setBodyModalParamsAction } from 'modules/modals';
import Button from 'containers/components/button';
import { getDecimalsSelector } from 'selectors';
import { useFormatTimestamp } from 'hooks/useFormatTimestamp';

export default function Entry(props) {
  const dispatch = useDispatch();
  const handleTime = useFormatTimestamp();

  const decimals = useSelector(getDecimalsSelector);
  const {
    eventType, height, event, ledgerId, timestamp,
    holdingType, holdingInfo, change, balance,
  } = props;

  const showInfo = useCallback(() => {
    if (eventType === 'BLOCK_GENERATED') {
      dispatch(setBodyModalParamsAction('INFO_BLOCK', height));
    } else {
      dispatch(setBodyModalParamsAction('INFO_TRANSACTION', event, eventType === 'PRIVATE_PAYMENT'));
    }
  }, [dispatch, event, eventType, height]);

  const handleInfoLedgerTransactionModal = () =>
    dispatch(setBodyModalParamsAction(
      'INFO_LEDGER_TRANSACTION',
      {
        ledgerId,
        eventType,  
      },
    ));

  return (
    <>
      {ledgerId && (
        <tr>
          <td className="blue-link-text">
            <Button
              color="blue-link"
              onClick={handleInfoLedgerTransactionModal}
              name={handleTime(timestamp)}
            />
          </td>
          <td>
            {ledgerId && eventType && (
              i18n.t(eventType.toLowerCase())
            )}
              &nbsp;&nbsp;
            <span className="zmdi zmdi-info pointer" onClick={showInfo} />
          </td>
          <td className="align-right">
            {holdingType === 'UNCONFIRMED_APL_BALANCE'
              && (change / decimals).toLocaleString('en', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
          </td>
          <td className="align-right">
            {holdingType === 'UNCONFIRMED_APL_BALANCE' && balance > 0
              && (balance / decimals).toLocaleString('en', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
          </td>
          <td className="align-right">
            {holdingInfo && holdingInfo.name}
          </td>
          <td className="align-right">
            {holdingType === 'UNCONFIRMED_CURRENCY_BALANCE'
              && holdingInfo && holdingInfo.name
              && (change / (10 ** holdingInfo.decimals)).toLocaleString('en', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
            {holdingType === 'UNCONFIRMED_ASSET_BALANCE'
              && (change / decimals).toLocaleString('en', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
          </td>
          <td className="align-right">
            {holdingType === 'UNCONFIRMED_CURRENCY_BALANCE'
              && holdingInfo && holdingInfo.name
              && (balance / (10 ** holdingInfo.decimals)).toLocaleString('en', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
            {holdingType === 'UNCONFIRMED_ASSET_BALANCE'
              && (balance / decimals).toLocaleString('en', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
          </td>
        </tr>
      )}
    </>
  );
}
