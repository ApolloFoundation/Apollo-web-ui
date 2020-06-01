/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Form, Formik } from 'formik';
import { NotificationManager } from 'react-notifications';
import { saveSendModalState } from '../../../../modules/modals';
import { importAccountAction, importAccountActionViaFile } from '../../../../actions/account';
import CustomInput from '../../../components/custom-input';
import InfoBox from '../../../components/info-box';
import InputUpload from '../../../components/input-upload';
import ButtonTabs from '../../../components/button-tabs';
import ErrorWrapper from './error-wrapper';
import Button from '../../../components/button';

const tabs = [
  {
    label: 'Secret file',
    id: 'file',
  },
  {
    label: 'Secret key',
    id: 'text',
  },
];

export default function ImportAccount(props) {
  const dispatch = useDispatch();

  const { account, handleClose } = props;

  const [format, setFormat] = useState('file');
  const [isGenerated, setIsGenerated] = useState(false);
  const [importAccount, setImportAccount] = useState(false);

  const handleFormSubmit = async values => {
    const {
      secretBytes, passPhrase, sender, deadline,
    } = values;
    let newImportAccount = null;
    if (format === 'text') {
      newImportAccount = await importAccountAction({
        secretBytes, sender, deadline,
      });
    } else if (format === 'file') {
      newImportAccount = await importAccountActionViaFile({
        passPhrase, sender, deadline,
      });
    }

    if (newImportAccount && newImportAccount.errorCode) {
      NotificationManager.error(newImportAccount.errorDescription, 'Error', 5000);
    } else if (format === 'text') {
      setIsGenerated(true);
      setImportAccount(newImportAccount);
    } else {
      NotificationManager.success('Your account imported successfully!', null, 5000);
      handleClose();
    }
  };

  const handleTab = currentTab => {
    setFormat(currentTab);
    setIsGenerated(false);
    setImportAccount(null);
  };

  const handleChangeForm = values => {
    dispatch(saveSendModalState(values));
  };

  useEffect(() => {
    if (account) {
      handleClose();
    }
  }, [account, handleClose]);

  return (
    <ErrorWrapper>
      <div className="dark-card">
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
                {format !== 'file' ? (
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
                      <InputUpload accept=".apl" id="file" />
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
                <div className="btn-box">
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
                        className="btn"
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
