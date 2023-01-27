import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { setBodyModalParamsAction } from 'modules/modals';

export default function CurrencyDescriptionComponent(props) {
  const dispatch = useDispatch();
  const {
    address, balances, currency, handleCurrentCurrency,
  } = props;

  const handleWithdrawModal = useCallback(() => {
    dispatch(setBodyModalParamsAction('WITHDRAW_CURRENCY', {
      balances,
      address,
    }));
  }, [address, balances, dispatch]);

  const handleExport = useCallback(async () => {
    dispatch(setBodyModalParamsAction('CONFIRM_EXPORT_WALLET', { ethAddress: address }));
  }, [address, dispatch]);

  return (
    <tr>
      <td>
        <CopyToClipboard
          text={address}
          onCopy={() => {
            NotificationManager.success('The wallet address has been copied to clipboard.');
          }}
        >
          <span className="cursor-pointer">{address}</span>
        </CopyToClipboard>
      </td>
      <td>{balances.eth}</td>
      <td>{balances.pax}</td>
      <td>
        <div className="btn-box inline">
          <Link
            to="/dex"
            className="btn primary bg-success"
            onClick={() => handleCurrentCurrency(currency)}
          >
            Buy
          </Link>
        </div>
      </td>
      <td>
        <div className="btn-box inline">
          <Link
            to="/dex"
            className="btn primary bg-danger"
            onClick={() => handleCurrentCurrency(currency)}
          >
            Sell
          </Link>
        </div>
      </td>
      <td>
        <div className="btn-box inline">
          <span
            className="btn primary defaullt"
            onClick={() => NotificationManager.error('This functionality will be delivered in future releases.', 'Error', 5000)}
          >
            View History
          </span>
        </div>
      </td>
      <td className="align-right">
        <div className="btn-box inline pr-1">
          <span
            className="btn primary defaullt"
            onClick={handleExport}
          >
            Export
          </span>
          <span
            className="btn primary defaullt"
            onClick={handleWithdrawModal}
          >
            Withdraw
          </span>
          <CopyToClipboard
            text={address}
            onCopy={() => {
              NotificationManager.success('The wallet address has been copied to clipboard.');
            }}
          >
            <span className="btn btn-green">
              Deposit
            </span>
          </CopyToClipboard>
        </div>
      </td>
    </tr>
  );
}
