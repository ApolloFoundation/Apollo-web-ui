/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { formatTimestamp } from '../../../../helpers/util/time';
import { getAccountInfoSelector } from '../../../../selectors';

const PoolItem = props => {
  const dispatch = useDispatch();
  const {decimals, actualBlock, unconfirmedBalanceATM} = useSelector(getAccountInfoSelector);
  const blocksLeft = parseInt(props.finishHeight) - parseInt(actualBlock);

  let isDisableVoteButton = props.minBalanceModel === 1 && parseFloat(props.minBalance) >= (unconfirmedBalanceATM / decimals);

  const handleInfoTransactionModal = () =>
    dispatch(setBodyModalParamsAction('INFO_TRANSACTION', props.poll));

  const handleInfoAccountModal = () =>
    dispatch(setBodyModalParamsAction('INFO_ACCOUNT', props.account));

  const handleCastVoteModal = () => dispatch(setBodyModalParamsAction('CAST_VOTE', props.poll));

  const handlePollResultModal = () => dispatch(setBodyModalParamsAction('POLL_RESULTS', props.poll));

  const handleTime = () => dispatch(formatTimestamp(props.timestamp));

  return (
    <tr>
      <td className="blue-link-text">
        <a onClick={handleInfoTransactionModal}>{props.name}</a>
      </td>
      <td>
        { (props.description.length > 100) ? `${props.description.slice(0, 100)}...` : props.description}
      </td>
      <td className="blue-link-text">
        <a onClick={handleInfoAccountModal}>
          {props.accountRS}
        </a>
      </td>
      <td>{handleTime()}</td>
      <td className="">
        {blocksLeft || ''}
      </td>
      <td className="align-right">
        <div className="btn-box inline">
          <button
            type="button"
            onClick={handleCastVoteModal}
            className={classNames('btn btn-default', { 'disabled':  isDisableVoteButton })}
          >
            Vote
          </button>
          <button
            type="button"
            onClick={handlePollResultModal}
            className="btn btn-default"
          >
            Results
          </button>
          <Link to={`/followed-polls/${props.poll}`} className="btn btn-default">View</Link>
        </div>
      </td>
    </tr>
  );
};

export default PoolItem;
