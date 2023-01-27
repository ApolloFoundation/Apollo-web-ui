import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual} from 'react-redux';
import { useFormikContext } from 'formik';
import CheckboxFormInput from 'containers/components/check-button-input/CheckboxWithFormik';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import crypto from "helpers/crypto/crypto";
import { getModalDataSelector } from 'selectors';
import { VaultWallet } from './VaultWallet';

const JoinShufflingForm = ({ shuffling }) => {
    const dispatch = useDispatch();
    const modalData = useSelector(getModalDataSelector, shallowEqual);
    const { values, setFieldValue } = useFormikContext();

    useEffect(() => {
        if (values.recipientSecretPhrase !== '') {
            dispatch(
                crypto.getAccountIdAsyncApl(values.recipientSecretPhrase)
            ).then(res =>  setFieldValue('generatedAccount', res));
        } else {
            setFieldValue('generatedAccount', '');
        }
    }, [values.recipientSecretPhrase]);

    return (
        <>
            <div className="form-group mb-15">
                <label>
                    Shuffling Id
                </label>
                <div>
                    {shuffling &&
                    <p>{shuffling.shuffling}</p>
                    }
                    {modalData && modalData.broadcast &&
                    <p>{modalData.broadcast.transaction}</p>
                    }
                </div>
            </div>
            {
                !values.isVaultWallet &&
                <CustomInput
                    label='Recipient secret phrase'
                    name="recipientSecretPhrase"
                    placeholder="Recipient Secret Phrase"
                    type='password'
                />
            }
            <CheckboxFormInput
                name='isVaultWallet'
                label='Use Vault Wallet for Shuffling'
                id="isVaultWallet-join-shaffilng-modal"
            />
            <div className="mobile-class mb-15 ">
                <VaultWallet />
            </div>
            {
                !values.isVaultWallet &&
                <CustomInput
                    label="Recipient Account"
                    disabled
                    name="generatedAccount"
                    placeholder="Account ID"
                />
            }
        </>
    );
}

export default JoinShufflingForm;