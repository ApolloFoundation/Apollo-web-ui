import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { setBodyModalParamsAction } from 'modules/modals';
import ContentLoader from 'containers/components/content-loader';
import {
  getDashboardInfoSelector,
  getEffectiveBalanceCalculateSelector,
  getTickerSelector
} from 'selectors';
import { numberToLocaleString } from 'helpers/format';
import { bigIntFormat } from 'helpers/util/bigNumberWrappers';

const TotalBalance = () => {
  const dispatch = useDispatch();
  const ticker = useSelector(getTickerSelector);
  const balance = useSelector(getEffectiveBalanceCalculateSelector);
  const { dashboardAccoountInfo } = useSelector(getDashboardInfoSelector, shallowEqual);

  const balanceAPL = numberToLocaleString(balance,  {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="card card-primary card-h-195">
      <div
        className="card-title cursor-pointer"
        onClick={() => setBodyModalParamsAction('ACCOUNT_DETAILS')}
      >
        <div className="title">Available Balance</div>
      </div>
      <div className="card-body">
        {dashboardAccoountInfo
          ? (
            <>
              <div
                className="balance-info cursor-pointer"
                onClick={() => dispatch(setBodyModalParamsAction('ACCOUNT_DETAILS'))}
              >
                <span className="balance">{balanceAPL}</span>
                <span className="currency">{ticker}</span>
              </div>
              <div className="wallet-info">
                <span className="label">Active Wallet ID:</span>
                <CopyToClipboard
                  text={dashboardAccoountInfo.accountRS}
                  onCopy={() => {
                    NotificationManager.success('The account has been copied to clipboard.');
                  }}
                >
                  <div className="wallet-id-wrap cursor-pointer">{dashboardAccoountInfo.accountRS}</div>
                </CopyToClipboard>
              </div>
            </>
          ) : (
            <ContentLoader white noPaddingOnTheSides />
          )}
      </div>
    </div>
  );
};

export default TotalBalance;
