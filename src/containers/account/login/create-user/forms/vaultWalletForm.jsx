import React, { useCallback, useState } from 'react';
import {
  Checkbox, Form, Text, TextArea,
} from 'react-form';
import { NotificationManager } from 'react-notifications';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import cn from 'classnames';
import {
  createAccountAction, generateAccountAction, generatePDF,
} from '../../../../../actions/account';
import ContentLoader from '../../../../components/content-loader';
import InputForm from '../../../../components/input-form';
import InfoBox from '../../../../components/info-box';

export default function VaultWalletForm(props) {
  const {
    onSubmit, activeTab, isCustomPassphraseTextarea,
    setIsCustomPassphraseTextarea, setAccountData,
    accountData, setSelectedOption, setIsValidating,
    handleClose, isPending, isValidating,
  } = props;

  const [keySeed, setKeySeed] = useState(null);
  const [isCustomPassphrase, setIsCustomPassphrase] = useState(true);
  const [isAccountLoaded, setIsAccountLoaded] = useState(false);

  const generateAccount = useCallback(async getFormState => {
    const requestParams = {};
    if (isCustomPassphraseTextarea && activeTab === 1) {
      const { values } = getFormState();
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

      setIsAccountLoaded(true);
      setAccountData(geneatedAccount);
      setKeySeed(newKeySeed);
      setIsCustomPassphrase(false);
    }
  }, [activeTab, isCustomPassphraseTextarea, setAccountData]);

  return (
    <Form
      onSubmit={onSubmit}
      render={({ submitForm, setValue, getFormState }) => (
        <form
          className={cn({
            'tab-body': true,
            active: activeTab === 1,
          })}
          onSubmit={submitForm}
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
                <div className="checkbox-group">
                  <Checkbox
                    className="lighten"
                    field="isCustomPassphrase"
                    onChange={e => setIsCustomPassphraseTextarea(e)}
                  />
                  <label>
                    Use custom secret phrase
                  </label>
                </div>
                {isCustomPassphraseTextarea && (
                  <div className="form-group row form-group-grey mb-15">
                    <label>
                      Your account secret phrase
                    </label>
                    <TextArea
                      field="newAccountpassphrse"
                      placeholder="Secret Phrase"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => generateAccount(getFormState)}
                  className="btn"
                >
                  Create account
                </button>
              </div>
            ) : (
              <div>
                {isAccountLoaded ? (
                  <>
                    <Text field="option" type="hidden" defaultValue={0} />
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
                    {keySeed
                    && accountData
                    && keySeed.secretBytes
                    && (
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
                            {accountData.passphrase}
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
                          <button type="button" className="btn btn-sm">
                            Copy account data to clipboard
                          </button>
                        </CopyToClipboard>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => generatePDF([
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
                          ])}
                        >
                          Print Wallet
                        </button>
                      </InfoBox>
                    )}
                    <div className="checkbox-group">
                      <Checkbox
                        defaultValue={false}
                        field="losePhrase"
                      />
                      <label>
                        I wrote down my Account ID, Secret phrase. It is now stored
                        in a secured place.
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="btn"
                      onClick={() => {
                        if (!getFormState().values.losePhrase) {
                          NotificationManager.error('You have to verify that you stored your private data', 'Error', 7000);
                          return;
                        }
                        setIsValidating(true);
                        setSelectedOption(0);
                      }}
                    >
                      Next
                    </button>
                  </>
                ) : (
                  <ContentLoader />
                )}
              </div>
            )}
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
                  <i
                    className="zmdi zmdi-portable-wifi-changes"
                  />
                </label>
                <div className="col-sm-9">
                  <InputForm
                    isPlain
                    className="form-control"
                    type="password"
                    field="secretPhrase"
                    placeholder="Secret Phrase"
                    setValue={setValue}
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
                    <button
                      type="submit"
                      name="closeModal"
                      className="btn"
                    >
                      Create New Account
                    </button>
                  )}
                <button
                  type="button"
                  name="closeModal"
                  className="btn"
                  onClick={handleClose}
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    />
  );
}
