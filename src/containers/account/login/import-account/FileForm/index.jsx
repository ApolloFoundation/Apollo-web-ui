import React, { useState, useEffect, useCallback } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { Form, Formik } from 'formik';
import i18n from 'i18next';
import { importAccountActionViaFile } from 'actions/account';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import InputUpload from 'containers/components/form-components/FIleInput';
import Button from 'containers/components/button';
import RedTriangle from 'assets/red-triangle.svg';
import { getConstantsSelector } from 'selectors';
import styles from '../index.module.scss';

export const FileForm = ({ handleClose, isActive }) => {
  const constants = useSelector(getConstantsSelector, shallowEqual);
  const [isError, setIsError] = useState(false);

  const handleFormSubmit = useCallback(async ({ passPhrase, keyStore }) => {
    if (!keyStore) {
      setIsError(true);
      NotificationManager.error(i18n.t("error_no_file_chosen"), 'Error', 5000);
      return;
    }
    setIsError(false);

    const newImportAccount = await importAccountActionViaFile({ passPhrase, keyStore });

    if (newImportAccount && newImportAccount.errorCode) {
      NotificationManager.error(newImportAccount.errorDescription, 'Error', 5000);
    } else {
      NotificationManager.success('Your account imported successfully!', null, 5000);
      handleClose();
    }
  }, [handleClose]);

  if (!isActive) return null;

  return (
    <Formik
      initialValues={{
        passPhrase: '',
        keyStore: '',
      }}
      onSubmit={handleFormSubmit}
    >
      <Form>
          <div className="form-group row form-group-white mb-15">
            <CustomInput
              type="password"
              label="Your account secret phrase"
              className="form-control"
              name="passPhrase"
              placeholder="Secret Phrase"
            />
          </div>
          <div className="form-group row form-group-grey mb-15">
            <label htmlFor="file">
              Your account secret file
            </label>
            <InputUpload
              accept=".apl"
              id="file"
              name="keyStore" 
              maxSize={constants?.maxImportSecretFileLength || 1000}
              hidenMaxSize
            />
          </div>
          {isError && (
            <div className={styles.importAccountError}>
              <img src={RedTriangle} alt='attention' className={styles.importAccountErrorIcon}/>
              <p className={styles.importAccountErrorText}>
                Please attach the secret file before proceeding.
              </p>
            </div>
          )}
          <div>
            <Button
              type="submit"
              className="btn btn-without"
              name="Restore account"
            />
          </div>
      </Form>
    </Formik>
  );
};