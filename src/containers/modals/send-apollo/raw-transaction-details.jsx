/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { NotificationManager } from 'react-notifications';
import {
  setBodyModalParamsAction, saveSendModalState, openPrevModal,
} from '../../../modules/modals';
import CustomInput from '../../components/custom-input/CustomInputWithFormik';
import CustomButton from '../../components/button';
import CustomTextArea from '../../components/form-components/TextArea/TextAreaWithFormik';

export default function RawTransactionDetails(props) {
  const dispatch = useDispatch();

  const { modalData, modalsHistory } = useSelector(state => state.modals);

  const { closeModal, processForm } = props;

  const handleFormSubmit = useCallback(async values => {
    const data = {
      feeATM: 0,
      transactionJSON: JSON.stringify({
        ...modalData.result.transactionJSON,
        signature: values.signature || '',
      }),
    };

    processForm(data, 'broadcastTransaction', 'Transaction has been submitted!', () => {
      dispatch(setBodyModalParamsAction(null, {}));
      NotificationManager.success('Transaction has been submitted!', null, 5000);
    });
  }, [dispatch, modalData, processForm]);

  return (
    <div className="modal-box">
      <Formik
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
        enableReinitialize
        onSubmit={handleFormSubmit}
      >
        {({ values }) => (
          <Form
            className="modal-form modal-send-apollo"
            onChange={() => dispatch(saveSendModalState(values))}
          >
            {modalData && modalData.request && (
              <div className="form-group-app">
                <button type="button" onClick={closeModal} className="exit">
                  <i className="zmdi zmdi-close" />
                </button>
                <div className="form-title">
                  {modalsHistory.length > 1 && (
                    <div
                      className="backMy"
                      onClick={() => dispatch(openPrevModal())}
                    />
                  )}
                  <p>Raw Transaction Details</p>
                </div>
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
                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                  <CustomButton
                    onClick={closeModal}
                    color="transparent"
                    className={`btn round round-top-left ${modalData.result.signatureHash ? 'round-bottom-right' : ''} bg-none`}
                    name="Close"
                  />
                  {!modalData.result.signatureHash && (
                    <CustomButton
                      type="submit"
                      className="btn btn-right blue round round-bottom-right bg-none"
                      name="Broadcast"
                    />
                  )}
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
