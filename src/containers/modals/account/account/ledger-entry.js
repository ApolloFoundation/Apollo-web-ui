import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { formatTimestamp } from '../../../../helpers/util/time';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import Button from '../../../components/button';

const Entry = ({
  event, eventType, timestamp, change, holdingType,
  holdingInfo, balance, ledgerId,
}) => {
  const dispatch = useDispatch();

  const { decimals } = useSelector(state => state.account);

  return (
    <tr key={uuidv4()}>
      <td>
        <Button
          color="blue-link"
          onClick={() => dispatch(setBodyModalParamsAction('INFO_LEDGER_TRANSACTION', ledgerId))}
          name={dispatch(formatTimestamp(timestamp))}
        />
      </td>
      <td>
          {eventType}
          &nbsp;&nbsp;
          <span className="zmdi zmdi-info pointer" onClick={() => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', event))}/>
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
