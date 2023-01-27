import React, {
  useCallback, useEffect, memo
} from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { FormikProvider, useFormik, Form } from 'formik';
import { getModalsSelector } from 'selectors';

function BackForm({ nameModal, onSubmit, children, className, initialValues = {}, isLoadValue, enableReinitialize }) {
  const { modalsHistory, modalData } = useSelector(getModalsSelector, shallowEqual);

  const formik = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize,
  });

  const loadValues = useCallback(values => {
    if (formik) {
      if (values) {
        formik.setValues(values);
        return;
      }
  
      if (modalsHistory.length > 0) {
        const myModal = modalsHistory[modalsHistory.length - 1];
        if (nameModal === myModal.modalName && myModal.value) {
          formik.setValues(myModal.value);
        }
      }
    }
  }, [modalsHistory, nameModal, formik?.setValues]);

  useEffect(() => {
    if (modalData && Object.keys(modalData).length > 0) {
      if (isLoadValue) {
        loadValues(modalData);
      }
    }
  }, [loadValues, modalData, isLoadValue]);


  return (
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit} className={className ?? "modal-form"}>
        {children}
      </Form>
    </FormikProvider>
  );
}

export default memo(BackForm);
