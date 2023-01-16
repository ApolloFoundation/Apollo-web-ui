/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import CustomTextArea from "../../components/form-components/TextArea/TextAreaWithFormik";
import CheckboxFormInput from "../../components/check-button-input/CheckboxWithFormik";
import CustomFormSelect from "../../components/form-components/CustomSelect";
import ModalBody from "../../components/modals/modal-body";
import { getHashRequest } from '../../../actions/hash';

const hashOptions = [
    {
        label: "SHA256",
        value: "SHA256"
    },
    {
        label: "SHA3",
        value: "SHA3",
    },
    {
        label: "SCRYPT",
        value: "SCRYPT",
    },
    {
        label: "RIPEMD160",
        value: "RIPEMD160"
    },
    {
        label: "Keccak25",
        value: "Keccak25"
    },
    {
        label: "RIPEMD160_SHA256",
        value: "RIPEMD160_SHA256"
    }
];

const HashCalculation = ({ closeModal }) => {
    const [generatedHash, setGeneratedHash] = useState(false);

    const handleFormSubmit = useCallback(async (values) => {
        const data = {
            secret: values.data,
            secretIsText: values.isMessage,
            hashAlgorithm: values.alg,
            feeATM: 0,
        };

        getHashRequest(data).then(res => {
            setGeneratedHash(res.hash);
        });

    }, []);

    return (
        <ModalBody
            modalTitle='Hash calculation'
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Calculate'
            isDisableSecretPhrase
            initialValues={{
                isMessage: true,
                alg: hashOptions[0].value,
            }}
        >
            <CustomTextArea
                label='Data'
                placeholder='Data to hash'
                name='data'
            />
            <CheckboxFormInput
                name='isMessage'
                label='Textual data representation'
                id="isMessage"
            />
            {hashOptions && (
                <CustomFormSelect
                    options={hashOptions}
                    label='Hash algorithm'
                    name='alg'
                />
            )}
            {generatedHash && (
                <div className='info-box blue-info'>
                    <div className="token word-brake">{generatedHash}</div>
                </div>
            )}
        </ModalBody>
    );
}

export default HashCalculation;
