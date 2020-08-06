import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { getBlockAction } from '../../../../../actions/blocks';
import { setBodyModalParamsAction } from '../../../../../modules/modals';
import './style.scss';

const infoAboutStep = {
  0: 'Step 1',
  1: 'Step 2',
  2: 'Step 3',
  3: 'Step 4',
};

export default function ContractStatusItem(props) {
  const dispatch = useDispatch();

  const { contracts, label, isContractHistory } = props;

  const account = useSelector(state => state.account);

  const getBlock = useCallback(async (type, blockHeight) => {
    const requestParams = { height: blockHeight };

    const block = await dispatch(getBlockAction(requestParams));

    if (block) {
      dispatch(setBodyModalParamsAction('INFO_BLOCK', block));
    } else {
      NotificationManager.error('Error', 'Error', 5000);
    }
  }, []);

  const userType = useCallback(sender => account.accountRS === sender, [account.accountRS]);

  const renderCommonInfo = useCallback((sender, orderId, counterOrderId, recipient) => (
    <>
      <tr>
        <td>Your Order ID:</td>
        <td>{userType(sender) ? orderId : counterOrderId}</td>
      </tr>
      <tr>
        <td>Partner Order ID:</td>
        <td>{userType(sender) ? counterOrderId : orderId}</td>
      </tr>
      <tr>
        <td>Partner Account:</td>
        <td>{userType(sender) ? recipient : sender}</td>
      </tr>
    </>
  ), []);

  const renderContractHistoryItem = useCallback(({
    orderId, counterOrderId, recipient, contractStatus, sender, counterTransferTxId, height, id, transferTxId, encryptedSecret, secretHash,
  }) => (
    <>
      <tr>
        <td>Contract Status:</td>
        <td>{infoAboutStep[contractStatus]}</td>
      </tr>
      <tr>
        <td>Height:</td>
        <td>
          <span className="blue-link-text" onClick={() => dispatch(getBlock('INFO_BLOCK', height))}>
            {height}
          </span>
        </td>
      </tr>
      <tr>
        <td>ID:</td>
        <td>{id}</td>
      </tr>
      {renderCommonInfo(sender, orderId, counterOrderId, recipient)}
      {(contractStatus === 1 || contractStatus === 2)
        && (
          <>
            <tr>
              <td>Secret Hash:</td>
              <td>{secretHash}</td>
            </tr>
            <tr>
              <td>Encrypted Secret:</td>
              <td>{encryptedSecret}</td>
            </tr>
            <tr>
              <td>Counter Transfer Tx Id:</td>
              <td>{counterTransferTxId}</td>
            </tr>
          </>
        )}
      {contractStatus === 2 && (
        <tr>
          <td>Transfer Tx Id:</td>
          <td>{transferTxId}</td>
        </tr>
      )}
    </>
  ), []);

  const renderBasicContractInfo = useCallback(({
    contractStatus, orderId, counterOrderId, sender, recipient, counterTransferTxId,
  }) => (
    <>
      <tr>
        <td>Contract Status:</td>
        <td>{infoAboutStep[contractStatus]}</td>
      </tr>
      {renderCommonInfo(sender, orderId, counterOrderId, recipient)}
      {(contractStatus === 1 || contractStatus === 2)
                && (
                <tr>
                  <td>
                    Partner transfer
                    money transaction:
                  </td>
                  <td>{counterTransferTxId}</td>
                </tr>
                )}
    </>
  ), []);

  return (
    <>
      {contracts && contracts.map((contract, key) => (
        <div key={key} className="contract-item">
          <span className="contract-item__label">
            {label}
          </span>
          <div className="transaction-table details">
            <table>
              <tbody>
                {isContractHistory
                  ? renderContractHistoryItem(contract)
                  : renderBasicContractInfo(contract)}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
}
