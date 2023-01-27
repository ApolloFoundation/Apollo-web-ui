import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { setAccountPassphrase } from 'modules/account';
import { cancelOffer } from "actions/wallet";
import ModalBody from 'containers/components/modals/modal-body';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import InfoBox from "containers/components/info-box";
import {
    getAccountSelector,
    getDecimalsSelector,
    getModalDataSelector,
    getTickerSelector
} from 'selectors';

const ConfirmCancelOffer = ({ closeModal, nameModal }) =>  {
    const dispatch = useDispatch();
    const [isPending, setIsPending] = useState(false);
    const {currency, pairRate, offerAmount, total, orderId } = useSelector(getModalDataSelector, shallowEqual);
    const account = useSelector(getAccountSelector);
    const ticker = useSelector(getTickerSelector);
    const decimals = useSelector(getDecimalsSelector);

    const handleFormSubmit = useCallback(async ({ passphrase }) => {
        if(!isPending) {
            setIsPending(true);
            if (!passphrase || passphrase.length === 0) {
                NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
                setIsPending(false);
                return;
            }

            const offer = await dispatch(cancelOffer({
                orderId,
                feeATM: decimals,
                sender: account,
                passphrase,
            }));
            if (offer) {
                dispatch(setAccountPassphrase(passphrase));
                closeModal();
            }
            setIsPending(false);
        }
    }, [dispatch, isPending, closeModal, decimals, account, orderId]);

    return (
        <ModalBody
            modalTitle='Confirm Order Cancellation'
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Cancel my order'
            isPending={isPending}
            isDisableSecretPhrase
            nameModel={nameModal}
        >
            <InfoBox default>
                If you are sure you want to cancel your order, type your passphrase to confirm.
            </InfoBox>
            <InfoBox attentionLeft>
            <p>
                Price {currency.toUpperCase()}: <span>{pairRate}</span>
            </p>
            <p>
                Amount {ticker}: <span>{offerAmount}</span>
            </p>
            <p>
                Total {currency.toUpperCase()}: <span>{total}</span>
            </p>
            </InfoBox>
            <TextualInputComponent
                name='passphrase'
                type='password'
                label='Secret Phrase'
                placeholder='Secret Phrase'
            />
        </ModalBody>
    );
}

export default ConfirmCancelOffer;
