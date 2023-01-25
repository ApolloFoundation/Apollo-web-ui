import React  from 'react';
import { Form } from 'react-form';
import { useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import InputForm from '../../../components/input-form';
import { getAdminPasswordSelector } from '../../../../selectors';
import { writeToLocalStorage } from '../../../../actions/localStorage';

export const AdminPasswordForm = () => {
  const adminPassword = useSelector(getAdminPasswordSelector);

  const handleGeneralSettingFormSubmit = ({ adminPassword }) => {
    if (adminPassword) {
      writeToLocalStorage('adminPassword', { adminPassword });
      NotificationManager.success('Admin password has been successfully saved!', null, 5000);
    }
  };

  return (
    <Form
      onSubmit={handleGeneralSettingFormSubmit}
      render={({ submitForm, setValue }) => (
        <form className="modal-form" onSubmit={submitForm}>
          <div className="form-group-app">
            <div className="form-group mb-15">
              <label>
                Admin password
              </label>
              <div>
                <InputForm
                  isPlain
                  className="form-control"
                  type="password"
                  field="adminPassword"
                  placeholder="Admin password"
                  setValue={setValue}
                  defaultValue={adminPassword}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-green"
            >
              Save
            </button>
          </div>
        </form>
      )}
    />
  )
}