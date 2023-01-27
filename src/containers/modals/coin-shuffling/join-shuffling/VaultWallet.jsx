import { useFormikContext } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import {CopyToClipboard} from "react-copy-to-clipboard";
import {NotificationManager} from "react-notifications";
import InfoBox from "containers/components/info-box";
import {generateAccountAction} from "actions/account";

export const VaultWallet = () => {
  const [vaultWallet, setVaultWallet] = useState(null);
  const { values, setFieldValue } = useFormikContext();

  const handleCopySuccess = useCallback(() =>
    NotificationManager.success('The account data has been copied to clipboard.'), 
    []
  );

  const handleVaultWalletCondition = useCallback(async (condition) => {
    if (condition) {
        const vaultWallet = await generateAccountAction({});

        if (vaultWallet) {
          setVaultWallet({
                    accountRS: vaultWallet.currencies[0].wallets[0].address,
                    passphrase: vaultWallet.passphrase,
                    publicKey: vaultWallet.currencies[0].wallets[0].publicKey,
          });
          setFieldValue('publicKey', vaultWallet.currencies[0].wallets[0].publicKey);
        }
        return;
    }
    setVaultWallet(null);
    setFieldValue('publicKey', '');
  }, []);

  useEffect(() => {
    handleVaultWalletCondition(values.isVaultWallet);
  }, [values.isVaultWallet]);

  if (!vaultWallet) return null;

  return (
    <InfoBox attentionLeft>
        <p className='mb-3'>
            Account ID: <span className='itatic'>{vaultWallet.accountRS}</span>
        </p>
        <p className='mb-3'>
            Secret Phrase:  <span className='itatic'>{vaultWallet.passphrase}</span>
        </p>
        <p className='mb-3'>
            Public Key: <span className='itatic'>{vaultWallet.publicKey}</span>
        </p>
        <CopyToClipboard
            text={
                `Account ID: ${vaultWallet.accountRS}\n` +
                `Secret Phrase: ${vaultWallet.passphrase}\n` +
                `Public Key: ${vaultWallet.publicKey}\n`
            }
            onCopy={handleCopySuccess}
        >
            <button type='button' className="btn btn-green">
                Copy account data to clipboard.
            </button>
        </CopyToClipboard>
    </InfoBox>
  );
}
