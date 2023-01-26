import React, { useCallback }  from 'react';
import { useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { FormikProvider, useFormik, Form } from 'formik';
import { getAdminPasswordSelector } from '../../../../selectors';
import { writeToLocalStorage } from '../../../../actions/localStorage';
import TextualInputComponent from '../../../components/form-components/TextualInput';

export const AdminPasswordForm = () => {
  const adminPassword = useSelector(getAdminPasswordSelector);

  const handleGeneralSettingFormSubmit = useCallback(({ adminPassword }) => {
    if (adminPassword) {
      writeToLocalStorage('adminPassword', { adminPassword });
      NotificationManager.success('Admin password has been successfully saved!', null, 5000);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      adminPassword,
    },
    onSubmit: handleGeneralSettingFormSubmit,
  })

  return (
    <FormikProvider value={formik}>
        <Form className="modal-form">
          <div className="form-group-app">
            <TextualInputComponent
              label="Admin password"
              type="password"
              name="adminPassword"
              placeholder="Admin password"
            />
            <button
              type="submit"
              className="btn btn-green"
            >
              Save
            </button>
          </div>
        </Form>
    </FormikProvider>
  );
}