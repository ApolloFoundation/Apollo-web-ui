import React, {
  useState, useCallback, useEffect,
} from 'react';
import { useSelector } from 'react-redux';
// import { Form } from 'react-form';
import { Formik, FormikProvider, useFormik, Form } from 'formik';
import { getMdalsSelector } from '../../../selectors';

export default function BackForm(props) {
  const {
    nameModal, getApi, onChange, onSubmit, render, children,
  } = props;

  // const [newForm, setNewForm] = useState(null);
  const [newModalData, setNewModalData] = useState(null);

  const { modalsHistory, modalData } = useSelector(getMdalsSelector);

  const formik = useFormik({
    initialValues: modalData,
    onSubmit,
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

  // const getForm = useCallback(form => {
  //   setNewForm(form);
  //   loadValues();

  //   if (getApi) {
  //     getApi(form);
  //   }
  // }, [getApi, loadValues]);

  useEffect(() => {
    if (modalData && Object.keys(modalData).length > 0) {
      setNewModalData(modalData);
      loadValues(modalData);
    }
  }, [loadValues, modalData, newModalData]);


  console.log("🚀 ~ file: modal-form-container.jsx ~ line 55 ~ BackForm ~ formik", formik)

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit} className="modal-form">
        {children}
      </Form>
    </FormikProvider>
    // <Form
    //   onChange={onChange}
    //   nameModal={nameModal}
    //   onSubmit={onSubmit}
    //   getApi={getForm}
    //   render={render}
    // >
    //   <>
    //   <Formik
    //     initialValues={{}}
    //     onSubmit={() => {}}
    //   >
    //     {(props) => {
    //       console.log(props);
    //       return 11;
    //     }}
    //   </Formik>
    //   {children}
    //   <div>34</div>
    //   </>
    // </Form>
  );
}
