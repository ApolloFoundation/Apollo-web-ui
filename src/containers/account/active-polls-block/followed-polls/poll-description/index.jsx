import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../../modules/modals';
import Button from '../../../../components/button';

import Pie from './pie-diagram';

const PollDescription = ({ colors, poll, pollResults }) => {
  const dispatch = useDispatch();

  const { decimals, unconfirmedBalanceATM: balanceAPL } = useSelector(state => state.account);

  let checkAction = false;

  if (poll.minBalanceModel === 1 && parseFloat(poll.minBalance) >= (balanceAPL / decimals)) {
    checkAction = true;
  }

  return (
    <div className="d-flex mb-3">
      <div className="card">
        <div className="card-title card-title-lg bg-primary">
          <span className="title-lg">{poll.name}</span>
        </div>
        <div className="card-body">
          <div className="form-group-app">
            <div className="wrap-info">
              <div className="mb-3">
                <label>
                  Account ID:
                </label>
                <div>
                  {poll.accountRS}
                </div>
              </div>
              <div className="mb-3">
                <label>
                  Poll ID:
                </label>
                <div>
                  {poll.poll}
                </div>
              </div>
              <div className="mb-3">
                <label>
                  Description:
                </label>
                <div>
                  {poll.description}
                </div>
              </div>
            </div>
            {!poll.finished && (
              <Button
                name="Vote in poll"
                size="lg"
                disabled={checkAction}
                onClick={() => dispatch(setBodyModalParamsAction('CAST_VOTE', poll.poll))}
              />
            )}
          </div>
        </div>
      </div>
      <div
        className="d-flex align-items-center justify-content-center p-3 w-100"
        style={{ transition: 'all 0.3s ease-in-out' }}
      >
        {colors.length > 0 && pollResults && poll.options && pollResults.results && (
          <Pie
            data={pollResults.results.map((el, index) => parseInt(el.result) || 0.05)}
            votes={poll.options}
            radius={150}
            hole={0}
            colors={colors}
            strokeWidth={1}
            stroke="rgba(0, 0, 0, .5)"
          />
        )}
      </div>
    </div>

  );
};

export default PollDescription;
