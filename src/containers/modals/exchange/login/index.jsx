import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { setAccountPassphrase } from 'modules/account';
import { getWallets } from 'actions/wallet';
import ModalBody from 'containers/components/modals/modal-body';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import { getAccountRsSelector } from 'selectors';

export default function LoginToExchange({ closeModal, nameModal }) {
  const dispatch = useDispatch();
  const accountRS = useSelector(getAccountRsSelector);
  const [isPending, setIsPending] = useState(false);

  const handleFormSubmit = useCallback(async ({ passphrase }) => {
    if (!passphrase || passphrase.length === 0) {
      NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
      return;
    }
    setIsPending(true);

    const params = {
      account: accountRS,
      passphrase,
    };
    const wallets = await dispatch(getWallets(params));
    setIsPending(false);
    if (wallets) {
      dispatch(setAccountPassphrase(passphrase));
      closeModal();
    }
  }, [accountRS, closeModal, dispatch]);

  return (
    <ModalBody
      modalTitle="Login to Exchange"
      closeModal={closeModal}
      handleFormSubmit={handleFormSubmit}
      submitButtonName="Enter"
      isDisableSecretPhrase
      nameModel={nameModal}
      isPending={isPending}
    >
      <TextualInputComponent
        name="passphrase"
        type="password"
        label="Secret Phrase"
        placeholder="Secret Phrase"
      />
    </ModalBody>
  );
}
