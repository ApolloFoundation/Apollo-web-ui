import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  Checkbox, Form, Text,
} from 'react-form';
import cn from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationManager } from 'react-notifications';
import { generatePDF } from '../../../../../actions/account';
import store from '../../../../../store';
import crypto from '../../../../../helpers/crypto/crypto';
import ContentLoader from '../../../../components/content-loader';
import InfoBox from '../../../../components/info-box';

export default function StandardWalletForm(props) {
  const dispatch = useDispatch();

  const {
    setGeneratedPassphrase, setGeneratedAccount, isCustomPassphraseTextarea,
    activeTab, generatedPassphrase, generatedAccount, setIsValidating, setSelectedOption,
  } = props;

  const [isRSAccountLoaded, setIsRSAccountLoaded] = useState(false);
  const [isCustomPassphraseStandardWallet, setIsCustomPassphraseStandardWallet] = useState(false);

  const generatePassphrase = useCallback(async getFormState => {
    let passphrase;
    if (isCustomPassphraseTextarea && activeTab === 1) {
      const { values } = getFormState();
      passphrase = values.newAccountpassphrse;
      if (!passphrase) {
        NotificationManager.error('Secret Phrase not specified.');
        return;
      }
    }

    const newGeneratedPassphrase = passphrase || crypto.generatePassPhraseAPL();
    const params = passphrase || newGeneratedPassphrase.join(' ');
    const newGeneratedAccount = store.dispatch(await dispatch(crypto.getAccountIdAsyncApl(params)));

    setGeneratedPassphrase(params);
    setGeneratedAccount(newGeneratedAccount);
    setIsRSAccountLoaded(true);
    setIsCustomPassphraseStandardWallet(true);
  }, [activeTab, dispatch, isCustomPassphraseTextarea, setGeneratedAccount, setGeneratedPassphrase]);

  return (
    <Form
      render={({ submitForm, getFormState }) => (
        <form
          className={cn({
            'tab-body': true,
            active: activeTab === 0,
          })}
          onSubmit={submitForm}
        >
          <InfoBox className="dark-info marked-list">
            <ul>
              <li className="check-icon">
                You can log in to this wallet using only your
                secret phrase
              </li>
              <li className="check-icon">Available to use from any device</li>
              <li className="minus-icon">
                2FA is available only on the device where it
                was enabled
              </li>
            </ul>
          </InfoBox>
          {!isCustomPassphraseStandardWallet ? (
            <>
              <button
                type="button"
                onClick={() => generatePassphrase(getFormState)}
                className="btn"
              >
                Create account
              </button>
            </>
          ) : (
            <div>
              {isRSAccountLoaded ? (
                <>
                  <Text
                    field="option"
                    type="hidden"
                    defaultValue={1}
                  />
                  <InfoBox className="dark-info">
                    <ul className="marked-list">
                      <li className="danger-icon">
                        <strong>Remember</strong>
                        {' '}
                        to
                        store your Account ID and secret
                        phrase in a secured place.
                        Make sure to write down this
                        secret phrase and store it
                        securely (the secret phrase is
                        order and case sensitive). This
                        secret phrase is needed to use
                        your wallet.
                      </li>
                    </ul>
                  </InfoBox>
                  {generatedPassphrase && (
                    <InfoBox attentionLeft className="dark-info">
                      <p className="mb-3">
                        Account ID:
                        {' '}
                        <span
                          className="itatic notranslate"
                        >
                          {generatedAccount}
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
                        {' '}
                        <span
                          className="itatic notranslate"
                        >
                          {generatedPassphrase}
                        </span>
                      </p>
                      <CopyToClipboard
                        text={
                          `Account ID: ${generatedAccount}\n`
                          + `Secret Phrase: ${generatedPassphrase}\n`
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
                            value: generatedAccount,
                          },
                          {
                            name: 'Secret Phrase',
                            value: generatedPassphrase,
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
                      I wrote down my secret phrase. It
                      is now stored in a secured
                      place.
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn"
                    onClick={() => {
                      if (!getFormState().values.losePhrase) {
                        NotificationManager.error('You have to verify that you stored your private data.', 'Error', 7000);
                        return;
                      }
                      setIsValidating(true);
                      setSelectedOption(1);
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
        </form>
      )}
    />
  );
}
