import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationManager } from 'react-notifications';
import Button from 'containers/components/button';
import InfoBox from 'containers/components/info-box';

export const AccountInfoMessage = ({ isCustomPhrase, account, secretPhrase,  publicKey}) => {
  const copyText = () => {
    let str = `Account ID: ${account}\n`
    + `Secret Phrase: ${secretPhrase}\n`;

    if (publicKey) {
      str += `Public Key: ${publicKey}\n`
    }
    return str;
  }

  return (
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
      <InfoBox attentionLeft className="dark-info">
        <p className="mb-3">
          Account ID:
          {' '}
          <span
            className="itatic notranslate"
          >
            {account}
          </span>
        </p>
        <p className="mb-3">
          {`Your ${isCustomPhrase ? 'randomly generated' : ''} secret phrase is:`}
        </p>
        <p className="mb-3">
          Secret Phrase:
          {' '}
          <span className="itatic notranslate">
            {secretPhrase}
          </span>
        </p>
        {publicKey && (
          <p className="mb-3">
            Public Key:
            <span
              className="itatic word-brake-for-info notranslate"
            >
              {publicKey}
            </span>
          </p>
        )}
        <CopyToClipboard
          text={copyText()}
          onCopy={() => {
            NotificationManager.success('The account data has been copied to clipboard.');
          }}
        >
          <Button
            name={`Copy account ${publicKey ? 'data' : ''} to clipboard`}
            size="sm"
          />
        </CopyToClipboard>
      </InfoBox>
    </>
  )
}