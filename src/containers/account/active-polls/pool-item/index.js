/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { formatTimestamp } from '../../../../helpers/util/time';
import { getTransactionAction } from '../../../../actions/transactions';

const mapStateToProps = state => ({
  actualBlock: state.account.actualBlock,
  decimals: state.account.decimals,
  balanceAPL: state.account.unconfirmedBalanceATM,
});

const mapDispatchToProps = dispatch => ({
  setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  formatTimestamp: time => dispatch(formatTimestamp(time)),
  getTransaction: transaction => dispatch(getTransactionAction(transaction)),
});

const PoolItem = props => {
  const blocksLeft = parseInt(props.finishHeight) - parseInt(props.actualBlock);
  let checkAction = false;
  if (props.minBalanceModel === 1 && parseFloat(props.minBalance) >= (props.balanceAPL / props.decimals)) {
    checkAction = true;
  }
  return (
    <tr>
      <td className="blue-link-text">
        <a onClick={() => props.setBodyModalParamsAction('INFO_TRANSACTION', props.poll)}>{props.name}</a>
      </td>
      <td className="">
        {' '}
        { (props.description.length > 100) ? `${props.description.slice(0, 100)}...` : props.description}
        {' '}
      </td>
      <td className="blue-link-text">
        <a onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.account)}>
          {' '}
          {props.accountRS}
          {' '}
        </a>
      </td>
      <td className="">
        {props.formatTimestamp(props.timestamp)}
      </td>
      <td className="">
        {blocksLeft || ''}
      </td>
      <td className="align-right">
        <div className="btn-box inline">
          <button
            type="button"
            onClick={() => props.setBodyModalParamsAction('CAST_VOTE', props.poll)}
            className={`btn btn-default ${checkAction ? 'disabled' : ''}`}
          >
            Vote
          </button>
          <button
            type="button"
            onClick={() => props.setBodyModalParamsAction('POLL_RESULTS', props.poll)}
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

export default connect(mapStateToProps, mapDispatchToProps)(PoolItem);
