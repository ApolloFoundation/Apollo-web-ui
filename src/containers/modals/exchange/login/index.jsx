import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { setAccountPassphrase } from '../../../../modules/account';
import { getWallets } from '../../../../actions/wallet';
import ModalBody from '../../../components/modals/modal-body';
import TextualInputComponent from '../../../components/form-components/TextualInput';
import { getAccountRsSelector } from '../../../../selectors';

export default function LoginToExchange({ closeModal, nameModal }) {
  const dispatch = useDispatch();
  const accountRS = useSelector(getAccountRsSelector);

  const handleFormSubmit = useCallback(async ({ passphrase }) => {
    if (!passphrase || passphrase.length === 0) {
      NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
      return;
    }

    const params = {
      account: accountRS,
      passphrase,
    };
    const wallets = await dispatch(getWallets(params));
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
