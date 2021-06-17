import React, {
  useState, useCallback, useEffect,
} from 'react';
import { useSelector } from 'react-redux';
import { Form } from 'react-form';

export default function BackForm(props) {
  const {
    nameModal, getApi, onChange, onSubmit, render, children,
  } = props;

  const [newForm, setNewForm] = useState(null);
  const [newModalData, setNewModalData] = useState(null);

  const { modalsHistory, modalData } = useSelector(state => state.modals);

  const loadValues = useCallback(values => {
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
  }, [modalsHistory, nameModal, newForm]);

  const getForm = useCallback(form => {
    setNewForm(form);
    loadValues();

    if (getApi) {
      getApi(form);
    }
  }, [getApi, loadValues]);

  useEffect(() => {
    // If new props has been received and form parameters have not already replaced
    if (modalData && Object.keys(modalData).length > 0 && !newModalData) {
      setNewModalData(modalData);
      loadValues(modalData);
    }
  }, [loadValues, modalData, newModalData]);

  return (
    <Form
      onChange={onChange}
      nameModal={nameModal}
      onSubmit={values => onSubmit(values)}
      getApi={value => getForm(value)}
      render={formApi => render(formApi)}
    >
      {children}
    </Form>
  );
}
