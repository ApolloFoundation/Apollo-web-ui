/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import { setBodyModalParamsAction } from 'modules/modals';
import { formatTransactionType, getPhasingTransactionVotersThunk } from 'actions/transactions';
import { getBlockAction } from 'actions/blocks';
import { Tooltip } from 'containers/components/tooltip';
import IconRed from 'assets/red-triangle.svg';
import { useFormatTimestamp } from 'hooks/useFormatTimestamp';
import { getAccountInfoSelector } from 'selectors';
import { bigIntDivision, bigIntFormat } from 'helpers/util/bigNumberWrappers';
import styles from './index.module.scss';

const Transaction = (props) => {
    const dispatch = useDispatch();
    const { decimals, constants } = useSelector(getAccountInfoSelector, shallowEqual);
    const handleTime = useFormatTimestamp();
    const [state, setState] = useState({
      phasing: null,
      transaction: null,
    });

    const {
      isUnconfirmed, timestamp, confirmations, amountATM,
      feeATM, sender, senderRS, recipient, recipientRS,
      height, type, subtype, attachment, errorMessage,
    } = props;

    const getPhasingTransactionInfo = useCallback(async () => {
      const phasing = await dispatch(getPhasingTransactionVotersThunk({ transaction: props.transaction }));

      if (phasing) {
        setState({
          phasing: phasing.polls[0],
          transaction: props.transaction,
        });
      }
    }, [props.transaction, dispatch]);

    const getBlock = (blockHeight) => async () => {
      const block = await dispatch(getBlockAction({ height: blockHeight }));

      if (block) {
        dispatch(setBodyModalParamsAction('INFO_BLOCK', block));
      }
    }

    const handleINfoTransactionModal = () => 
      dispatch(setBodyModalParamsAction('INFO_TRANSACTION', props, (type === 0 && subtype === 1)));

    const handleFailedTransactionModal = () =>
      dispatch(setBodyModalParamsAction('TRANSACTION_FAIL', props));

    const handleInfoAccountModal = (acc) => () =>
      dispatch(setBodyModalParamsAction('INFO_ACCOUNT', acc));

    useEffect(() => {
      getPhasingTransactionInfo();
    }, [getPhasingTransactionInfo]);
  
  const transactionType = constants.transactionTypes && constants.transactionTypes[type];
  const { phasing } = state;

  return (
    <tr>
      {constants && (
        <>
          <td className={classNames("blue-link-text", styles.transactionDate)}>
            <span
              className={classNames(styles.transactionDateLink, "blue-link-text")}
              onClick={handleINfoTransactionModal}
            >
              {handleTime(timestamp)}
            </span>
            {errorMessage && (
              <div onClick={handleFailedTransactionModal}>
                <Tooltip icon={IconRed}>
                  <div>
                    Transaction FAIL
                  </div> 
                </Tooltip>
              </div>
            )}
          </td>
          <td>
            {!!transactionType && (
              (transactionType.subtypes[subtype].name === 'AliasSell' && amountATM === '0' && attachment.priceATM === '0')
                ? formatTransactionType('AliasTransfer')
                : formatTransactionType(transactionType.subtypes[subtype].name)
            )}
          </td>
          <td className="align-right">
            {
              (amountATM === '0' && attachment.priceATM && attachment.priceATM !== '0')
                ? bigIntFormat(bigIntDivision(attachment.priceATM, decimals))
                : bigIntFormat(bigIntDivision(amountATM, decimals))
            }
          </td>
          <td className="align-right">
            {feeATM / decimals}
          </td>
          <td>
            <span className="blue-link-text" onClick={handleInfoAccountModal(sender)}>
              {senderRS}
            </span>
            &nbsp;
            &nbsp;
            <i className="zmdi zmdi-long-arrow-right" />
            &nbsp;
            &nbsp;
            <span  className="blue-link-text" onClick={handleInfoAccountModal(recipient)}>
              {recipientRS}
            </span>
          </td>
          <td className="align-right phasing">

            {phasing && (
            <div
              className="phasing-box"
              style={{ zIndex: 12 }}
              data-custom-at="top"
              data-cat-id={JSON.stringify({ ...props.transaction, ...phasing })}
            >
              <spna className="phasing-box__icon">
                <i className="zmdi zmdi-accounts-alt" />
              </spna>
                            &nbsp;
                            &nbsp;
              <span className="phasing-box__result">
                {phasing.result}
                {' '}
                /
                {phasing.approved ? phasing.result : phasing.quorum}
              </span>
            </div>
            )}
          </td>

          <td className="align-right">
            {!isUnconfirmed ? (
              <span className="blue-link-text" onClick={getBlock(height)}>
                {height}
              </span>
            ) : (
              <span>---</span>
            )}
          </td>
          <td className="align-right blue-link-text">
            {confirmations}
          </td>
        </>
      )}
    </tr>
  );
}

export default Transaction;
