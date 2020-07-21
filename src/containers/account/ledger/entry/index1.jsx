/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import i18n from 'i18next';
import { useDispatch } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { formatTimestamp } from '../../../../helpers/util/time';
import { ONE_APL } from '../../../../constants';
import Button from '../../../components/button';
import '../styles.scss';

export default function Entry(props) {
  const dispatch = useDispatch();

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
                  ledgerId,
                  eventType === 'PRIVATE_PAYMENT',
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
              && (change / ONE_APL).toFixed(1)}
          </td>
          <td className="align-right">
            {holdingType === 'UNCONFIRMED_APL_BALANCE' && balance > 0
              && (balance / ONE_APL).toLocaleString('en')}
          </td>
          <td className="align-right">
            {holdingInfo && holdingInfo.name}
          </td>
          <td className="align-right">
            {holdingType === 'UNCONFIRMED_CURRENCY_BALANCE'
              && holdingInfo && holdingInfo.name
              && (change / 1).toFixed(2)}
            {holdingType === 'UNCONFIRMED_ASSET_BALANCE'
              && (change / ONE_APL).toFixed(2)}
          </td>
          <td className="align-right">
            {holdingType === 'UNCONFIRMED_CURRENCY_BALANCE'
              && holdingInfo && holdingInfo.name
              && (balance / 1).toLocaleString('en')}
            {holdingType === 'UNCONFIRMED_ASSET_BALANCE'
              && (balance / ONE_APL).toLocaleString('en')}
          </td>
        </tr>
      )}
    </>
  );
}
