import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import cn from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationManager } from 'react-notifications';
import { useLoginModal } from 'hooks/useLoginModal';
import { generatePDF } from 'actions/account';
import crypto from 'helpers/crypto/crypto';
import ContentLoader from 'containers/components/content-loader';
import Button from 'containers/components/button';
import InfoBox from 'containers/components/info-box';
import { getTickerSelector } from 'selectors';

export default function StandardWalletForm(props) {
  const dispatch = useDispatch();

  const {
    setGeneratedPassphrase, setGeneratedAccount, isCustomPassphraseTextarea,
    activeTab, generatedPassphrase, generatedAccount, setIsValidating, setSelectedOption,
  } = props;

  const ticker = useSelector(getTickerSelector);
  const [isRSAccountLoaded, setIsRSAccountLoaded] = useState(false);
  const [isCustomPassphraseStandardWallet, setIsCustomPassphraseStandardWallet] = useState(false);

  const generatePassphrase = useCallback(async () => {
    const newGeneratedPassphrase = crypto.generatePassPhraseAPL();
    const params = newGeneratedPassphrase.join(' ');
    const newGeneratedAccount = await dispatch(crypto.getAccountIdAsyncApl(params, ticker));

    setGeneratedPassphrase(params);
    setGeneratedAccount(newGeneratedAccount);
    setIsRSAccountLoaded(true);
    setIsCustomPassphraseStandardWallet(true);
  }, [dispatch, setGeneratedAccount, setGeneratedPassphrase, ticker]);

  const handleGeneratePDF = useCallback(() => {
    generatePDF([
      {
        name: 'Account ID',
        value: generatedAccount,
      },
      {
        name: 'Secret Phrase',
        value: generatedPassphrase,
      },
    ]);
  }, [generatePDF, generatedPassphrase, generatedAccount]);

  const { loginModalButton } = useLoginModal(handleGeneratePDF);

  const handleSubmit = () => {
    setIsValidating(true);
    setSelectedOption(1);
  };

  return (
    <Formik
      initialValues={{
        option: 1,
      }}
      onSubmit={handleSubmit}
      validateOnMount
      validateOnChange
    >
      {({ values, handleSubmit }) => (
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
              className="btn-without"
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
                          name="Copy account to clipboard"
                          size="sm"
                        />
                      </CopyToClipboard>
                    </InfoBox>
                  )}
                  {loginModalButton(handleSubmit, values)}
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
