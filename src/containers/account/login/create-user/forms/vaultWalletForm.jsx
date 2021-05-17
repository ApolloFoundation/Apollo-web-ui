import React, { useCallback, useState } from 'react';
import { Form, Formik } from 'formik';
import { NotificationManager } from 'react-notifications';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import cn from 'classnames';
import { useLoginModal } from 'helpers/hooks/useLoginModal';
import {
  createAccountAction, generateAccountAction, generatePDF,
} from '../../../../../actions/account';
import ContentLoader from '../../../../components/content-loader';
import CheckboxFormInput from '../../../../components/check-button-input';
import CustomInput from '../../../../components/custom-input';
import Button from '../../../../components/button';
import InfoBox from '../../../../components/info-box';

export default function VaultWalletForm(props) {
  const {
    onSubmit, activeTab, isCustomPassphraseTextarea,
    setIsCustomPassphraseTextarea, setAccountData, currPassphrase,
    accountData, setSelectedOption, setIsValidating,
    handleClose, isPending, isValidating, setCurrPassphrase,
  } = props;

  const [keySeed, setKeySeed] = useState(null);
  const [isCustomPassphrase, setIsCustomPassphrase] = useState(true);
  const [isAccountLoaded, setIsAccountLoaded] = useState(false);
  
  const handleGeneratePDF = () => 
    generatePDF([
      {
        name: 'Account ID',
        value: accountData.accountRS,
      },
      {
        name: 'Secret Phrase',
        value: accountData.passphrase,
      },
      {
        name: 'Public Key',
        value: accountData.publicKey,
      },
    ]);
  
  const { loginModalButton } = useLoginModal(handleGeneratePDF);

  const generateAccount = useCallback(async values => {
    const requestParams = {};
    if (isCustomPassphraseTextarea && activeTab === 1) {
      requestParams.passphrase = values.newAccountpassphrse;
      if (!requestParams.passphrase) {
        NotificationManager.error('Secret Phrase not specified.');
        return;
      }
    }

    const geneatedAccount = await generateAccountAction(requestParams);
    if (geneatedAccount) {
      const newKeySeed = await createAccountAction({
        account: geneatedAccount.accountRS,
        passphrase: geneatedAccount.passphrase,
      });

      setCurrPassphrase(values.newAccountpassphrse);
      setIsAccountLoaded(true);
      setAccountData(geneatedAccount);
      setKeySeed(newKeySeed);
      setIsCustomPassphrase(false);
    }
  }, [activeTab, isCustomPassphraseTextarea, setAccountData]);

  const handleNext = useCallback(() => {
    setIsValidating(true);
    setSelectedOption(0);
  }, [setIsValidating, setSelectedOption]);

  return (
    <Formik
      initialValues={{
        option: 1,
        losePhrase: false,
      }}
      onSubmit={onSubmit}
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
          {isCustomPassphrase
            ? (
              <div>
                <InfoBox>
                  You can create your own custom secret
                  phrase or create an account with a
                  randomly generated secret phrase.
                </InfoBox>
                <CheckboxFormInput
                  name="isCustomPassphrase"
                  label="Use custom secret phrase"
                  onChange={() => setIsCustomPassphraseTextarea(!isCustomPassphraseTextarea)}
                />
                {isCustomPassphraseTextarea && (
                  <CustomInput
                    label="Your account secret phrase"
                    name="newAccountpassphrse"
                    placeholder="Secret Phrase"
                  />
                )}
                <Button
                  onClick={() => generateAccount(values)}
                  name="Create account"
                />
              </div>
            ) : (
              <div>
                {isAccountLoaded ? (
                  <>
                    <InfoBox className="dark-info">
                      <ul className="marked-list">
                        <li className="danger-icon">
                          <strong>Remember</strong>
                          {' '}
                          to store your Account ID and
                          secret phrase in a secured place. Make sure to write
                          down this secret phrase and store it securely (the
                          secret phrase is order and case sensitive). This secret
                          phrase is needed to use your wallet.
                        </li>
                      </ul>
                    </InfoBox>
                    {accountData && (
                      <InfoBox attentionLeft className="dark-info">
                        <p className="mb-3">
                          Account ID:
                          <span
                            className="itatic notranslate"
                          >
                            {accountData.accountRS}
                          </span>
                        </p>
                        <p className="mb-3">
                          Your
                          {' '}
                          {!isCustomPassphraseTextarea && 'randomly generated'}
                          {' '}
                          secret
                          phrase is:
                        </p>
                        <p className="mb-3">
                          Secret Phrase:
                          <span
                            className="itatic notranslate"
                          >
                            {currPassphrase}
                          </span>
                        </p>
                        <p className="mb-3">
                          Public Key:
                          <span
                            className="itatic word-brake-for-info notranslate"
                          >
                            {accountData.publicKey}
                          </span>
                        </p>
                        <CopyToClipboard
                          text={
                            `Account ID: ${accountData.accountRS}\n`
                            + `Secret Phrase: ${accountData.passphrase}\n`
                            + `Public Key: ${accountData.publicKey}\n`
                          }
                          onCopy={() => {
                            NotificationManager.success('The account data has been copied to clipboard.');
                          }}
                        >
                          <Button
                            name="Copy account data to clipboard"
                            size="sm"
                          />
                        </CopyToClipboard>
                        <Button
                          name="Print Wallet"
                          size="sm"
                          onClick={handleGeneratePDF}
                        />
                      </InfoBox>
                    )}
                    <CheckboxFormInput
                      label="I wrote down my Account ID, Secret phrase. It is now stored
                      in a secured place."
                      name="losePhrase"
                    />
                    {loginModalButton(handleNext, values)}
                  </>
                ) : (
                  <ContentLoader />
                )}
              </div>
            )}
          {/* TODO: need to check */}
          {isValidating && (
            <div>
              <div className="form-title">
                <p>Create Your Wallet</p>
              </div>
              <div
                className="form-group row form-group-white mb-15"
                style={{ marginBottom: 15 }}
              >
                <label className="col-sm-3 col-form-label">
                  Secret phrase&nbsp;
                  <i className="zmdi zmdi-portable-wifi-changes" />
                </label>
                <div className="col-sm-9">
                  <CustomInput
                    className="form-control"
                    name="secretPhrase"
                    label="Secret Phrase"
                    placeholder="Secret Phrase"
                    type="password"
                  />
                </div>
              </div>
              <div className="btn-box align-buttons-inside absolute right-conner">
                {isPending
                  ? (
                    <div
                      style={{ width: 121.5 }}
                      className="btn btn-right blue round round-top-left round-bottom-right"
                    >
                      <div className="ball-pulse">
                        <div />
                        <div />
                        <div />
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      name="Create New Account"
                    />
                  )}
                <Button
                  name="Back"
                  onClick={handleClose}
                />
              </div>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}
