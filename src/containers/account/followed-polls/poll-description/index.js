import React from 'react';
import { connect } from 'react-redux';
import Pie from '../pie-diagram';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import {
  getDecimalsSelector, getUnconfirmedBalanceATMSelector
} from '../../../../selectors';

const PollDescription = ({
  colors, poll, pollResults, setBodyModalParamsAction, balanceAPL, decimals,
}) => {
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
            <button
              type="button"
              onClick={() => setBodyModalParamsAction('CAST_VOTE', poll.poll)}
              className={`btn btn-default btn-lg ${checkAction ? 'disabled' : ''}`}
            >
              Vote in poll
            </button>
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

const mapStateToProps = state => ({
  decimals: getDecimalsSelector(state),
  balanceAPL: getUnconfirmedBalanceATMSelector(state),
});

const mapDispatchToProps = {
  setBodyModalParamsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PollDescription);
