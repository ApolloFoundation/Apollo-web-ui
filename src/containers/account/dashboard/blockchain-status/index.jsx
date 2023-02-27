import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { formatTimestamp } from 'helpers/util/time';
import { setBodyModalParamsAction } from 'modules/modals';
import { getForging, setForging } from 'actions/login';
import { readFromLocalStorage } from 'actions/localStorage';
import { ReactComponent as ClockIcon } from 'assets/clock-icon.svg';
import ContentLoader from 'containers/components/content-loader';
import Button from 'containers/components/button';
import { getAccountInfoSelector, getEffectiveBalanceCalculateSelector } from 'selectors';

export default function BlockchainStatus() {
  const dispatch = useDispatch();

  const {
    passPhrase: secretPhrase, is2FA, actualBlock,
    timestamp, blockchainStatus, forgingStatus, accountRS,
  } = useSelector(getAccountInfoSelector, shallowEqual);
  const effectiveBalanceAPL = useSelector(getEffectiveBalanceCalculateSelector)

  const setForgingData = action => ({
    getStatus: action,
    handleSuccess: () => {},
  });

  const handleSetForging = useCallback(async action => {
    if (!effectiveBalanceAPL || +effectiveBalanceAPL < 1000) {
      NotificationManager.error('Your effective balance must be greater than 1000 APL to forge.', 'Error', 5000);
      return;
    }

    const prevAccountRSstring = readFromLocalStorage('APLUserRS');
    const prevAccountRS  = prevAccountRSstring && JSON.parse(prevAccountRSstring);

    const secret = readFromLocalStorage('secretPhrase');
    const passPhrase = secret ? JSON.parse(secret) : secretPhrase;
    if (!passPhrase || is2FA || prevAccountRS !== accountRS) {
      dispatch(setBodyModalParamsAction('CONFIRM_FORGING', setForgingData(action)));
    } else {
      const forging = await dispatch(setForging({ requestType: action }));

      if (forging) {
        if (!forging.errorCode) {
          const newForgingStatus = await dispatch(getForging());

          if (newForgingStatus.errorCode && newForgingStatus.errorCode !== 5) {
            NotificationManager.error('Something went wrong. Please, try again later', 'Error', 5000);
          }
        } else {
          NotificationManager.error(forging.errorDescription, 'Error', 5000);
        }
      }
    }
  }, [accountRS, dispatch, effectiveBalanceAPL, is2FA, secretPhrase]);

  const currentForgingStatus = useMemo(() => {
    if (!forgingStatus) {
      return (
        <ContentLoader white noPaddingOnTheSides className="m-0" />
      );
    }

    if (!forgingStatus.errorCode) {
      return (
        <div className="connect-status success">
          <div className="d-flex align-items-center">
            <div className="connect-icon" />
            <span>Forging</span>
          </div>
          <Button
            color="white"
            className="ml-2"
            name="Stop Forging"
            onClick={() => handleSetForging('stopForging')}
          />
        </div>
      );
    }

    return (
      <div className="connect-status">
        <div className="d-flex align-items-center">
          <div className="connect-icon" />
          <span>{forgingStatus.errorCode === 5 ? 'Not forging' : 'Unknown forging status'}</span>
        </div>
        <Button
          color="white"
          className="ml-2"
          name="Start Forging"
          onClick={() => handleSetForging('startForging')}
        />
      </div>
    );
  }, [forgingStatus, handleSetForging]);

  return (
    <div className="card card-success card-h-195">
      <div className="card-title">
        <div className="title">Blockchain Status</div>
        <div className="connect-status-wrap">
          <div className="connect-status success">
            <div className="connect-icon" />
            <span>Live</span>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <div className="ml-15">
            {actualBlock && timestamp
              ? (
                <>
                  <p className="label label-icon-left">
                    <ClockIcon />
                    Last updated:
                  </p>
                  <p>
                    `Block `
                    {actualBlock}
                  </p>
                  <p>{dispatch(formatTimestamp(timestamp))}</p>
                </>
              ) : (
                <ContentLoader white noPaddingOnTheSides className="m-0" />
              )}
            {!!(blockchainStatus && blockchainStatus.blockTime) && (
              <div>
                <span className="label">Transaction time:&nbsp;</span>
                <span>
                  {blockchainStatus.blockTime}
                  {' '}
                  sec
                </span>
              </div>
            )}
          </div>
        </div>
        {currentForgingStatus}
      </div>
    </div>
  );
}
