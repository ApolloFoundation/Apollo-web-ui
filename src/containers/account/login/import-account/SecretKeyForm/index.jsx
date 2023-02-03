/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

 import React, { useState, useCallback } from 'react';
 import { CopyToClipboard } from 'react-copy-to-clipboard';
 import { Form, Formik } from 'formik';
 import { NotificationManager } from 'react-notifications';
 import { importAccountAction } from 'actions/account';
 import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
 import InfoBox from 'containers/components/info-box';
 import Button from 'containers/components/button';
 
export const SecretKeyForm = ({ handleClose }) => {
  const [importAccount, setImportAccount] = useState(null);

  const handleFormSubmit = useCallback(async ({ secretBytes, passPhrase }) => {
    const newImportAccount = await importAccountAction({ secretBytes, passPhrase });

    if (newImportAccount && newImportAccount.errorCode) {
      NotificationManager.error(newImportAccount.errorDescription, 'Error', 5000);
      return;
    }
    setImportAccount(newImportAccount);
  }, []);

  return (
    <Formik
      initialValues={{
        secretBytes: '',
      }}
      onSubmit={handleFormSubmit}
    >
      <Form>
          <div className="form-group row form-group-grey mb-15">
            <CustomInput
              type="textarea"
              label="Your account secret key"
              className="form-control"
              name="secretBytes"
              placeholder="Secret Key"
            />
          </div>
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
          <div>
            {importAccount
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
      </Form>
    </Formik>
  )
}