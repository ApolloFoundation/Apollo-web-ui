import {NotificationManager} from "react-notifications";
import {
    setBodyModalParamsAction, 
    IS_MODAL_PROCESSING
} from '../../../../modules/modals';
import crypto from '../../../../helpers/crypto/crypto';

export const handleFormSubmit = async(values) => {
    const {dispatch} = this.store;
    let data = {
        shufflingFullHash: this.props.modalData.broadcast ? this.props.modalData.broadcast.fullHash : this.state.shuffling.shufflingFullHash,
        recipientSecretPhrase: values.recipientSecretPhrase,
        secretPhrase: values.secretPhrase,
        recipientPublicKey: await crypto.getPublicKeyAPL(values.recipientSecretPhrase, false),
        createNoneTransactionMethod: true,
        code2FA: values.code2FA
    };

    if (values.isVaultWallet) {
        data.recipientAccount = this.state.vaultWallet.accountRS;
        data.recipientPassphrase = this.state.vaultWallet.passphrase;

        delete data.recipientSecretPhrase;
    }

    this.processForm(data, 'startShuffler', 'Shuffling Started!', () => {
        dispatch({
            type: IS_MODAL_PROCESSING,
            payload: false
        })

        dispatch(setBodyModalParamsAction(null, {}));
        NotificationManager.success('Shuffling Started!', null, 5000);
    })
};