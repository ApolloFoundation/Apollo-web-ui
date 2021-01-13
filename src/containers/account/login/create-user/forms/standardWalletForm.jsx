import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import cn from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationManager } from 'react-notifications';
import { generatePDF } from '../../../../../actions/account';
import store from '../../../../../store';
import crypto from '../../../../../helpers/crypto/crypto';
import ContentLoader from '../../../../components/content-loader';
import Button from '../../../../components/button';
import InfoBox from '../../../../components/info-box';
import CheckboxFormInput from '../../../../components/check-button-input';

export default function StandardWalletForm(props) {
  const dispatch = useDispatch();

  const {
    setGeneratedPassphrase, setGeneratedAccount, isCustomPassphraseTextarea,
    activeTab, generatedPassphrase, generatedAccount, setIsValidating, setSelectedOption,
  } = props;

  const { ticker } = useSelector(state => state.account);
  const [isRSAccountLoaded, setIsRSAccountLoaded] = useState(false);
  const [isCustomPassphraseStandardWallet, setIsCustomPassphraseStandardWallet] = useState(false);

  const generatePassphrase = useCallback(async () => {
    const newGeneratedPassphrase = crypto.generatePassPhraseAPL();
    const params = newGeneratedPassphrase.join(' ');
    const newGeneratedAccount = store.dispatch(await dispatch(crypto.getAccountIdAsyncApl(params, ticker)));

    setGeneratedPassphrase(params);
    setGeneratedAccount(newGeneratedAccount);
    setIsRSAccountLoaded(true);
    setIsCustomPassphraseStandardWallet(true);
  }, [dispatch, setGeneratedAccount, setGeneratedPassphrase, ticker]);

  const handleSubmit = ({ losePhrase }) => {
    if (!losePhrase) {
      NotificationManager.error('You have to verify that you stored your private data.', 'Error', 7000);
      return;
    }
    setIsValidating(true);
    setSelectedOption(1);
  };

  return (
    <Formik
      initialValues={{
        option: 1,
        losePhrase: false,
      }}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form
          className={cn({
            'tab-body': true,
            active: activeTab === 0,
          })}
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
            <Button
              name="Create account"
              onClick={() => generatePassphrase(values)}
            />
          ) : (
            <div>
              {isRSAccountLoaded ? (
                <>
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
                        <Button
                          name="Copy account data to clipboard"
                          size="sm"
                        />
                      </CopyToClipboard>
                      <Button
                        name="Print Wallet"
                        className="btn"
                        size="sm"
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
                      />
                    </InfoBox>
                  )}
                  <CheckboxFormInput
                    name="losePhrase"
                    label="I wrote down my secret phrase. It
                      is now stored in a secured
                      place."
                  />
                  <Button
                    name="Next"
                    type="submit"
                  />
                </>
              ) : (
                <ContentLoader />
              )}
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}
