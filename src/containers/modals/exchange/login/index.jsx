import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { setAccountPassphrase } from '../../../../modules/account';
import { getWallets } from '../../../../actions/wallet';
import ModalBody from '../../../components/modals/modal-body';
import TextualInputComponent from '../../../components/form-components/textual-input';
// TODO update
export default function LoginToExchange(props) {
  const dispatch = useDispatch();

  const { closeModal, nameModal } = props;

  const { accountRS } = useSelector(state => state.account);

  const handleFormSubmit = useCallback(async values => {
    const { passphrase } = values;
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
        field="passphrase"
        type="password"
        label="Secret Phrase"
        placeholder="Secret Phrase"
      />
    </ModalBody>
  );
}
