import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNamse from 'classnames';
import { formatTimestamp } from '../../../helpers/util/time';
import { formatTransactionType } from '../../../actions/transactions';
import { setBodyModalParamsAction } from '../../../modules/modals';
import { ONE_APL } from '../../../constants';
import { ReactComponent as ArrowIcon } from '../../../assets/arrow-right-long.svg';

export default function TransactionItem(props) {
  const dispatch = useDispatch();
  const {
    amountATM, attachment, senderRS, recipientRS,
    type, subtype, sender, confirmations, timestamp,
    height, feeATM,
  } = props;

  const {
    constants, actualBlock, account, accountRS,
  } = useSelector(state => state.account);

  const isDexOrder = !!constants.transactionTypes
    && constants.transactionTypes[type].subtypes[subtype].name === 'DexOrder';
  const isAliasSell = !!constants.transactionTypes
    && constants.transactionTypes[type].subtypes[subtype].name === 'AliasSell';
  const newSenderRS = (senderRS && senderRS === accountRS) ? 'You' : senderRS;
  const newRecipientRS = (recipientRS && recipientRS === accountRS) ? 'You' : recipientRS;
  const transactionType = constants.transactionTypes
    && formatTransactionType(constants.transactionTypes[type].subtypes[subtype].name);
  const marketplaceTypes = [
    'DIGITAL GOODS DELISTING', 'DIGITAL GOODS PURCHASE', 'DIGITAL GOODS PRICE CHANGE',
    'DIGITAL GOODS LISTING', 'DIGITAL GOODS QUANTITY CHANGE',
  ];

  const transactionTypeContent = useCallback(condition => {
    if (condition) {
      return newSenderRS;
    }

    return (
      <div className="transaction-type text-ellipsis">{transactionType}</div>
    );
  }, [newSenderRS, transactionType]);

  const transactionInfo = useMemo(() => {
    if (isDexOrder) {
      return transactionTypeContent(attachment.offerCurrency !== 0);
    }

    if (recipientRS) {
      return (
        <span>{newRecipientRS}</span>
      );
    }

    return (
      <div className="transaction-type text-ellipsis">{transactionType}</div>
    );
  }, [
    attachment.offerCurrency, isDexOrder, newRecipientRS,
    recipientRS, transactionType, transactionTypeContent,
  ]);

  const transactionDate = useMemo(() => {
    return dispatch(formatTimestamp(timestamp));
  }, [dispatch, timestamp]);

  return (
    <div
      className="transaction-item cursor-pointer"
      onClick={async () => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', props.transaction))}
    >
      <div className="transaction-box">
        <div className="d-flex justify-content-between mb-2">
          <div className="">
            {isAliasSell && amountATM === '0' && attachment.priceATM === '0' ? (
              <div className="transaction-type">
                {formatTransactionType('AliasTransfer')}
              </div>
            ) : (
              <div className="transaction-type">
                {transactionType}
              </div>
            )}
            <div className="transaction-date">
              {transactionDate}
            </div>
            <div className="transaction-confirmation">
              <span>Confirmation:&nbsp;</span>
              {actualBlock < height ? (
                <div className="ball-pulse">
                  <div />
                  <div />
                  <div />
                </div>
              ) : (
                confirmations
              )}
            </div>
          </div>
          <div
            className={classNamse({
              'transaction-amount': true,
              'transaction-amount__right': true,
              success: (account !== sender) || (isDexOrder && attachment.offerCurrency !== 0),
              danger: (account === sender) || (isDexOrder && attachment.offerCurrency === 0),
            })}
          >
            {isDexOrder
              ? `${attachment.offerCurrency === 0 ? '-' : ''}${attachment.offerAmount / ONE_APL}`
              : `${account === sender ? '-' : ''}${(
                ((amountATM === '0' && attachment.priceATM && attachment.priceATM !== '0')
                  ? attachment.priceATM
                  : amountATM
                ) / ONE_APL
              )}`}
            {marketplaceTypes.includes(transactionType) && (
              <div className="transaction-confirmation fee">
                <span className="price__lg">Price for </span>
                <span className="price__md">Listing:</span>
                -
                {feeATM / ONE_APL}
              </div>
            )}
          </div>
        </div>
        <div className="transaction-rs-wrap d-flex justify-content-between align-items-center">
          <div className={newSenderRS === 'You' ? 'transaction-you mr-2' : 'transaction-rs text-ellipsis mr-2'}>
            {isDexOrder
              ? (
                transactionTypeContent(attachment.offerCurrency === 0)
              ) : (
                newSenderRS
              )}
          </div>
          <div
            className={classNamse({
              arrow: true,
              success: (account !== sender) || (isDexOrder && attachment.offerCurrency !== 0),
              danger: (account === sender) || (isDexOrder && attachment.offerCurrency === 0),
            })}
          >
            <ArrowIcon />
          </div>
          <div className={newRecipientRS === 'You' ? 'transaction-you ml-2' : 'transaction-rs text-ellipsis ml-2'}>
            {transactionInfo}
          </div>
        </div>
      </div>
    </div>
  );
}
