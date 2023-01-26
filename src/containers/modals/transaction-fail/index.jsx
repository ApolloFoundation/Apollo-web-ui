import React from 'react';
import { useSelector } from 'react-redux';
import { getModalDataSelector } from '../../../selectors';
import ModalBody from "../../components/modals/modal-body";

export const TransactionFail = ({ closeModal }) => {
  const transaction = useSelector(getModalDataSelector);
  return (
    <ModalBody
      modalTitle={`Transaction fail info`}
      closeModal={closeModal}
      isDisableFormFooter
      isDisableSecretPhrase
      isWide
    >
      <div className="transaction-table-body transparent full-info">
        <table>
          <tbody>
            <tr>
              <td>
                Status:
              </td>
              <td>
                FAIL
              </td>
            </tr>
            <tr>
              <td>
                  Error message:
              </td>
              <td>
                  {transaction.errorMessage || 'some error message'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ModalBody>
  );
}