import React, { useCallback, useState } from 'react';
import { Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import cn from 'classnames';
import {
  createAccountAction, generateAccountAction, generatePDF,
} from 'actions/account';
import CheckboxFormInput from 'containers/components/check-button-input/CheckboxWithFormik';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import Button from 'containers/components/button';
import InfoBox from 'containers/components/info-box';
import { setModalType } from 'modules/modals';
import { AccountInfoMessage } from '../AccountInfoMessage';

export default function VaultWalletForm({ activeTab, setAccountData }) {
  const dispatch = useDispatch();
  const [accountInfo, setAccountInfo] = useState(null);

  const handleGeneratePDF = () => {
    generatePDF([
      {
        name: 'Account ID',
        // path to our address after change api response
        value: accountInfo.account,
      },
      {
        name: 'Secret Phrase',
        value: accountInfo.secretPhrase,
      },
      {
        name: 'Public Key',
        // path to our public key after change api response
        value: accountInfo.publicKey,
      },
      {
        name: 'Secret Key',
        value: accountInfo.keySeed.secretBytes
      }
    ]);
  }
  
  const generateAccount = useCallback(async values => {
    if (values.isCustomPassphrase && !values.newAccountpassphrse) {
      NotificationManager.error('Secret Phrase not specified.');
      return;
    }
    let requestParams = {};
    if (values.isCustomPassphrase) {
      requestParams.passphrase = values.newAccountpassphrse;
    }
    
    const geneatedAccount = await generateAccountAction(requestParams);
    
    const passphrase = values.isCustomPassphrase ? values.newAccountpassphrse : geneatedAccount.passphrase;
    
    if (geneatedAccount) {
      const newKeySeed = await createAccountAction({
        account: geneatedAccount.currencies[0].wallets[0].address,
        passphrase,
      });

      setAccountInfo({
        account: geneatedAccount.currencies[0].wallets[0].address,
        secretPhrase: passphrase,
        publicKey: geneatedAccount.currencies[0].wallets[0].publicKey,
        keySeed: newKeySeed,
      });
    }
  }, [setAccountInfo]);

  const handleNextStep = () => {
    dispatch(setModalType('SAVE_CREDENTIALS'));
    handleGeneratePDF();
    setAccountData(accountInfo);
  }

  return (
    <Formik
      initialValues={{
        isCustomPassphrase: false,
        newAccountpassphrse: '',
      }}
      onSubmit={generateAccount}
    >
      {({ values }) => (
        <Form
          className={cn({
            'tab-body': true,
            active: activeTab === 1,
          })}
        >
          <InfoBox className="dark-info">
            <ul className="marked-list">
              <li className="check-icon">The most secure Apollo Wallet.</li>
              <li className="check-icon">
                You can log in using your
                Account ID.
              </li>
              <li className="check-icon">
                The wallet is encrypted (via Secret File) on one
                device.
              </li>
              <li className="check-icon">
                You can export/import your Secret File to use on
                other devices.
              </li>
              <li className="check-icon">
                2FA works from any device when you use your
                Vault.
              </li>
              <li className="minus-icon">
                If you lose your device or uninstall the wallet before exporting your secret file, you will lose access to your account.
              </li>
            </ul>
          </InfoBox>
          {/** this is for first step where you can insert custom secret phrase */}
          {!accountInfo && (
              <div>
              <InfoBox>
                You can create your own custom secret
                phrase or create an account with a
                randomly generated secret phrase.
              </InfoBox>
              <CheckboxFormInput
                id="isCustomPassphraseLoginPage"
                name="isCustomPassphrase"
                label="Use custom secret phrase"
              />
              {values.isCustomPassphrase && (
                <CustomInput
                  label="Your account secret phrase"
                  name="newAccountpassphrse"
                  placeholder="Secret Phrase"
                />
              )}
              <Button
                className="btn-without"
                onClick={() => generateAccount(values)}
                name="Create account"
              />
            </div>
          )}
          {/** this is for second step where you can see your account, secret phrase and public key */}
          {accountInfo && (
             <>
                <AccountInfoMessage
                  account={accountInfo.account}
                  secretPhrase={accountInfo.secretPhrase}
                  publicKey={accountInfo.publicKey}
                  isCustomPhrase={values.isCustomPassphrase}
                />
                <Button
                  className="btn-without"
                  name="Create account and get account info"
                  type="button"
                  onClick={handleNextStep}
                />
            </>
          )}
        </Form>
      )}
    </Formik>
  );
}
