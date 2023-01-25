import React, {
  useState, useCallback, useEffect,
} from 'react';
import { useSelector } from 'react-redux';
import { Form } from 'react-form';
import { getMdalsSelector } from '../../../selectors';

export default function BackForm(props) {
  const {
    nameModal, getApi, onChange, onSubmit, render, children,
  } = props;

  const [newForm, setNewForm] = useState(null);
  const [newModalData, setNewModalData] = useState(null);

  const { modalsHistory, modalData } = useSelector(getMdalsSelector);

  const loadValues = useCallback(values => {
    if (newForm) {
      if (values) {
        newForm.setAllValues(values);
        return;
      }
  
      if (modalsHistory.length > 0) {
        const myModal = modalsHistory[modalsHistory.length - 1];
        if (nameModal === myModal.modalName && myModal.value) {
          newForm.setAllValues(myModal.value);
        }
      }
    }
  }, [modalsHistory, nameModal, newForm?.setAllValues]);

  const getForm = useCallback(form => {
    setNewForm(form);
    loadValues();

    if (getApi) {
      getApi(form);
    }
  }, [getApi, loadValues]);

  useEffect(() => {
    if (modalData && Object.keys(modalData).length > 0) {
      setNewModalData(modalData);
      loadValues(modalData);
    }
  }, [loadValues, modalData, newModalData]);

  return (
    <Form
      onChange={onChange}
      nameModal={nameModal}
      onSubmit={onSubmit}
      getApi={getForm}
      render={render}
    >
      {children}
    </Form>
  );
}
