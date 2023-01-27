/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import CustomTextArea from 'containers/components/form-components/TextArea/TextAreaWithFormik';
import ModalBody from 'containers/components/modals/modal-body';
import { getModalDataSelector } from 'selectors';

export default function RawTransactionDetails({ closeModal, processForm }) {
  const dispatch = useDispatch();

  const modalData = useSelector(getModalDataSelector, shallowEqual);

  const handleFormSubmit = useCallback(async values => {
    const data = {
      feeATM: 0,
      transactionJSON: JSON.stringify({
        ...modalData.result.transactionJSON,
        signature: values.signature || '',
      }),
    };

    processForm(data, 'broadcastTransaction', 'Transaction has been submitted!', () => {
      closeModal();
      NotificationManager.success('Transaction has been submitted!', null, 5000);
    });
  }, [dispatch, modalData, processForm, closeModal]);

  return (
      <ModalBody
        initialValues={{
          transactionJSON: (
            modalData && modalData.result && JSON.stringify(modalData.result.transactionJSON)
          ) || '',
          unsignedTransactionBytes: (
            modalData && modalData.result && modalData.result.unsignedTransactionBytes
          ) || '',
          transactionBytes: (
            modalData && modalData.result && modalData.result.transactionBytes
          ) || '',
          fullHash: (
            modalData && modalData.result && modalData.result.fullHash
          ) || '',
        }}
        handleFormSubmit={handleFormSubmit}
        modalTitle="Raw Transaction Details"
        submitButtonName={!modalData?.result?.signatureHash && "Broadcast"}
        closeModal={closeModal}
        isDisableSecretPhrase
        enableReinitialize
      >
            {modalData && modalData.request && (
              <>
                {(!modalData.result.signatureHash && modalData.result.unsignedTransactionBytes) && (
                  <div className="form-group row form-group-white mb-15 col-sm-12">
                    <CustomTextArea
                      label="Unsigned Transaction Bytes"
                      placeholder="Signed Transaction Bytes"
                      name="unsignedTransactionBytes"
                      disabled
                    />
                  </div>
                )}
                {modalData.result.transactionJSON && (
                  <div className="form-group row form-group-white mb-15 col-sm-12">
                    <CustomTextArea
                      label={modalData.result.signatureHash
                        ? 'Signed Transaction JSON'
                        : 'Unsigned Transaction JSON'}
                      placeholder="Transaction JSON"
                      name="transactionJSON"
                      disabled
                    />
                  </div>
                )}
                {(modalData.result.signatureHash && modalData.result.transactionBytes) && (
                  <div className="form-group row form-group-white mb-15 col-sm-12">
                    <CustomTextArea
                      label="Signed Transaction Bytes"
                      placeholder="Transaction JSON"
                      name="transactionBytes"
                      disabled
                    />
                  </div>
                )}
                {modalData.result.fullHash && (
                  <div className="form-group row form-group-white mb-15 col-sm-12">
                    <CustomInput
                      label="Full Transaction Hash"
                      name="fullHash"
                      disabled
                      placeholder="Full Transaction Hash"
                    />
                  </div>
                )}
                {modalData.result.signatureHash
                  ? (
                    <div className="form-group row form-group-white mb-15 col-sm-12">
                      <CustomInput
                        label="Signature Hash"
                        name="signatureHash"
                        disabled
                        placeholder="Signature Bytes"
                      />
                    </div>
                  ) : (
                    <div className="form-group row form-group-white mb-15 col-sm-12">
                      <CustomTextArea
                        label="Signature"
                        placeholder="Signature"
                        name="signature"
                        disabled
                      />
                    </div>
                  )}
              </>
            )}
      </ModalBody>
  );
}
