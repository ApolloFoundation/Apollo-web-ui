import React from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { setBodyModalParamsAction } from 'modules/modals';

export const ActionTab = ({ transaction, recipientRS, currency }) => {
  const dispatch = useDispatch();

  const handleSendApollo = () =>
    dispatch(setBodyModalParamsAction('SEND_APOLLO', {recipient: recipientRS, feeATM: "1"}));

  const handleComposeMessageModal = () =>
    dispatch(setBodyModalParamsAction('COMPOSE_MESSAGE', {recipient: recipientRS}));

  const handleSaveAccount = () =>
    dispatch(setBodyModalParamsAction('SAVE_ACCOUNT', recipientRS));

  const handleTransferCurrency = () => {
    const data = {
        recipient: recipientRS,
        ...currency,
    }
    dispatch(setBodyModalParamsAction('TRANSFER_CURRENCY', data));
  }


  if (!transaction) return null;

  return (
      <div className="flexible-grid">

          <button
              type='button'
              onClick={handleSendApollo}
              className={classNames('btn btn-green', { 'disabled': !transaction.recipientRS })}
          >
              Send Apollo
          </button>
          <button
              type='button'
              onClick={handleComposeMessageModal}
              className={classNames('btn btn-green', { 'disabled': !transaction.recipientRS })}
          >
              Send a message
          </button>
          <button
              type='button'
              onClick={handleSaveAccount}
              className={classNames('btn btn-green', { 'disabled': !transaction.recipientRS })}
          >
              Add as contact
          </button>
          <button
              type='button'
              onClick={handleTransferCurrency}
              className={
                  classNames('btn btn-green', {
                      'disabled': !transaction.recipientRS || !currency,
                    }
                  )
              }
          >
              Transfer Currency
          </button>
      </div>
  );
}