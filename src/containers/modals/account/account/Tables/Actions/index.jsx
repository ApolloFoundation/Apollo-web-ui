import React from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { setBodyModalParamsAction } from 'modules/modals';

export const Actions = ({ recipient, account }) => {
  const dispatch = useDispatch();

  const handleSendApollo = () => dispatch(setBodyModalParamsAction('SEND_APOLLO', {recipient, feeATM: "1"}, {recipient}));

  const handleTransferCurrency = () =>
    dispatch(setBodyModalParamsAction('TRANSFER_CURRENCY', {recipient}, {recipient}));

  const handleMessage = () => dispatch(setBodyModalParamsAction('COMPOSE_MESSAGE', {recipient}, {recipient}));

  const handleSaveContact = () => dispatch(setBodyModalParamsAction('SAVE_ACCOUNT', {recipient}, {recipient}));

  return (
    <div className="flexible-grid">
      <span
          onClick={handleSendApollo}
          className={classNames("btn btn-green", {
              "disabled": !account
          })}
      >
          Send Apollo
      </span>
      <span
          onClick={handleTransferCurrency}
          className={classNames("btn btn-green", {
              "disabled": !account
          })}
      >
          Send currency
      </span>
      <span
          onClick={handleMessage}
          className={classNames("btn btn-green", {
              "disabled": !account
          })}
      >
          Send a message
      </span>
      <span
          onClick={handleSaveContact}
          className={classNames("btn btn-green", {
              "disabled": !account
          })}
      >
          Add as contact
      </span>
    </div>
  );
}
