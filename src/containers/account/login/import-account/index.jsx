/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useEffect, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Form, Formik } from 'formik';
import { NotificationManager } from 'react-notifications';
import classNames from 'classnames';
import i18n from 'i18next';
import { saveSendModalState } from 'modules/modals';
import { importAccountAction, importAccountActionViaFile } from 'actions/account';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import InfoBox from 'containers/components/info-box';
import InputUpload from 'containers/components/form-components/FIleInput';
import ButtonTabs from 'containers/components/button-tabs';
import Button from 'containers/components/button';
import RedTriangle from 'assets/red-triangle.svg';
import { getConstantsSelector } from 'selectors';
import ErrorWrapper from './error-wrapper';
import styles from './index.module.scss';

const formats = {
  file: 'file',
  text: 'text'
}

const tabs = [
  {
    label: 'Secret file',
    id: formats.file,
  },
  {
    label: 'Secret key',
    id: formats.text,
  },
];

export default function ImportAccount(props) {
  const dispatch = useDispatch();
  const constants = useSelector(getConstantsSelector, shallowEqual);
  const { account, handleClose } = props;

  const [format, setFormat] = useState(formats.file);
  const [isGenerated, setIsGenerated] = useState(false);
  const [importAccount, setImportAccount] = useState(false);
  const [isError, setIsError] = useState(false); 

  const handleFormSubmit = useCallback(async values => {
    const {
      secretBytes, passPhrase, keyStore,
    } = values;
    let newImportAccount = null;
    if (format === formats.text) {
      newImportAccount = await importAccountAction({ secretBytes, passPhrase });
    } 
    if (format === formats.file) {
      if (!keyStore) {
        setIsError(true);
        NotificationManager.error(i18n.t("error_no_file_chosen"), 'Error', 5000);
        return;
      }
      newImportAccount = await importAccountActionViaFile({ passPhrase, keyStore });
    }

    if (newImportAccount && newImportAccount.errorCode) {
      NotificationManager.error(newImportAccount.errorDescription, 'Error', 5000);
      setIsError(true);
    } else if (format === formats.text) {
      setIsGenerated(true);
      setImportAccount(newImportAccount);
      setIsError(false);
    } else {
      NotificationManager.success('Your account imported successfully!', null, 5000);
      setIsError(false);
      handleClose();
    }
  }, [format, handleClose]);

  const handleTab = useCallback(currentTab => {
    setFormat(currentTab);
    setIsGenerated(false);
    setImportAccount(null);
  }, []);

  const handleChangeForm = useCallback(values => {
    dispatch(saveSendModalState(values));
  }, [dispatch]);

  useEffect(() => {
    if (account) {
      handleClose();
    }
  }, [account, handleClose]);

  return (
    <ErrorWrapper>
      <div className={classNames("dark-card", styles.importAccountWrapper)}>
        <span
          onClick={handleClose}
          className="exit"
        >
          <i className="zmdi zmdi-close" />
        </span>
        <Formik
          initialValues={{}}
          onSubmit={handleFormSubmit}
        >
          {({ values }) => (
            <Form onChange={() => handleChangeForm(values)}>
              <p className="title">Import Account</p>
              <div className="form-tabulator">
                <ButtonTabs
                  tabs={tabs}
                  onClick={handleTab}
                  isActive={format}
                />
                <InfoBox className="dark-info">
                  <ul className="marked-list">
                    <li className="danger-icon">
                      {format !== 'file'
                        ? <span>Please note that after import of the secret key the usage of the same vault wallet on different nodes will cause creation of different ETH, PAX, BTC wallets for each node.</span>
                        : <span>Please enter your account secret file. The file should have the .apl extension. If not,  add .apl to the file name manually please.</span>}
                    </li>
                  </ul>
                </InfoBox>
                {format !== formats.file ? (
                  <div className="form-group row form-group-grey mb-15">
                    <CustomInput
                      type="textarea"
                      label="Your account secret key"
                      className="form-control"
                      name="secretBytes"
                      placeholder="Secret Key"
                    />
                  </div>
                ) : (
                  <>
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
                  </>
                )}
                {importAccount && (
                  <InfoBox attentionLeft className="dark-info">
                    <p className="mb-3">
                      Account ID:
                      {' '}
                      <span className="itatic">
                        {importAccount.accountRS}
                      </span>
                    </p>
                    <p className="mb-3">
                      Secret Phrase:
                      {' '}
                      <span className="itatic">
                        {importAccount.passphrase}
                      </span>
                    </p>
                    <CopyToClipboard
                      text={
                        `Account ID: ${importAccount.accountRS}\n`
                        + `Secret Phrase: ${importAccount.passphrase}\n`
                      }
                      onCopy={() => {
                        NotificationManager.success('The account data has been copied to clipboard.');
                      }}
                    >
                      <Button
                        className="btn btn-sm"
                        name="Copy account data to clipboard."
                      />
                    </CopyToClipboard>
                  </InfoBox>
                )}
                {importAccount && (
                  <InfoBox className="dark-info">
                    <ul className="marked-list">
                      <li className="danger-icon">
                        <strong>Remember</strong>
                        {' '}
                        to store your Account ID,
                        passphrase, and Secret Key in a secured place.
                        Make sure to write down this passphrase and store it
                        securely (the passphrase is order and case sensitive). This
                        passphrase is needed to use your wallet.
                      </li>
                    </ul>
                  </InfoBox>
                )}
                {(format === formats.file && isError) && (
                  <div className={styles.importAccountError}>
                    <img src={RedTriangle} alt='attention' className={styles.importAccountErrorIcon}/>
                    <p className={styles.importAccountErrorText}>
                      Please attach the secret file before proceeding.
                    </p>
                  </div>
                )}
                <div>
                  {isGenerated
                    ? (
                      <Button
                        className="btn"
                        onClick={handleClose}
                        name="Close"
                      />
                    ) : (
                      <Button
                        type="submit"
                        className="btn btn-without"
                        name="Restore account"
                      />
                    )}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </ErrorWrapper>
  );
}
