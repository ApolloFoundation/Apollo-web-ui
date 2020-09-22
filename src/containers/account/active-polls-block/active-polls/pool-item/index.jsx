/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { setBodyModalParamsAction } from '../../../../../modules/modals';
import { formatTimestamp } from '../../../../../helpers/util/time';
import Button from '../../../../components/button';

export default function PoolItem({
  minBalanceModel, minBalance, finishHeight, name,
  description, poll, accountRS, account, timestamp,
}) {
  const dispatch = useDispatch();

  const { actualBlock, decimals, balanceAPL } = useSelector(state => state.account);

  const blocksLeft = parseInt(finishHeight) - parseInt(actualBlock);

  let checkAction = false;

  if (minBalanceModel === 1 && parseFloat(minBalance) >= (balanceAPL / decimals)) {
    checkAction = true;
  }

  return (
    <tr key={uuidv4()}>
      <td key={uuidv4()}>
        <span
          className="blue-link-text"
          onClick={() => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', poll))}
        >
          {name}
        </span>
      </td>
      <td key={uuidv4()} className="">
        {' '}
        { (description.length > 100) ? `${description.slice(0, 100)}...` : description}
        {' '}
      </td>
      <td key={uuidv4()}>
        <span
          className="blue-link-text"
          onClick={() => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', account))}
        >
          {' '}
          {accountRS}
          {' '}
        </span>
      </td>
      <td key={uuidv4()} className="">
        {dispatch(formatTimestamp(timestamp))}
      </td>
      <td key={uuidv4()} className="">
        {blocksLeft || ''}
      </td>
      <td key={uuidv4()} className="align-right">
        <div className="btn-box inline">
          <Button
            onClick={() => dispatch(setBodyModalParamsAction('CAST_VOTE', poll))}
            disabled={checkAction}
            name="Vote"
          />
          <Button
            onClick={() => dispatch(setBodyModalParamsAction('POLL_RESULTS', poll))}
            name="Results"
          />
          <Link to={`/followed-polls/${poll}`} className="btn btn-default">View</Link>
        </div>
      </td>
    </tr>
  );
}
