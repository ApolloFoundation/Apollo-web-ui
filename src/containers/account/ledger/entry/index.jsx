/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import i18n from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { formatTimestamp } from '../../../../helpers/util/time';
import Button from '../../../components/button';
import { numberToLocaleString } from 'helpers/format';

export default function Entry(props) {
  const dispatch = useDispatch();

  const { decimals } = useSelector(state => state.account);
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

  return (
    <>
      {ledgerId && (
        <tr>
          <td className="blue-link-text">
            <Button
              color="blue-link"
              onClick={() => {
                dispatch(setBodyModalParamsAction(
                  'INFO_LEDGER_TRANSACTION',
                  {
                    ledgerId,
                    eventType,  
                  },
                ));
              }}
              name={dispatch(formatTimestamp(timestamp))}
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
              && numberToLocaleString(change / decimals, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
          </td>
          <td className="align-right">
            {holdingType === 'UNCONFIRMED_APL_BALANCE' && balance > 0
              && numberToLocaleString(balance / decimals, {
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
              && numberToLocaleString(change / (10 ** holdingInfo.decimals), {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
            {holdingType === 'UNCONFIRMED_ASSET_BALANCE'
              && numberToLocaleString(change / decimals, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
          </td>
          <td className="align-right">
            {holdingType === 'UNCONFIRMED_CURRENCY_BALANCE'
              && holdingInfo && holdingInfo.name
              && numberToLocaleString(balance / (10 ** holdingInfo.decimals), {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
            {holdingType === 'UNCONFIRMED_ASSET_BALANCE'
              && numberToLocaleString(balance / decimals, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
          </td>
        </tr>
      )}
    </>
  );
}
