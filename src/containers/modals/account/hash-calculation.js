/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import CustomTextArea from "../../components/form-components/TextArea/TextAreaWithFormik";
import CheckboxFormInput from "../../components/check-button-input/CheckboxWithFormik";
import CustomFormSelect from "../../components/form-components/CustomSelect";
import ModalBody from "../../components/modals/modal-body";

const hashOptions = [
    {
        label: "SHA256",
        value: "2"
    },
    {
        label: "SHA3",
        value: "3",
    },
    {
        label: "SCRYPT",
        value: "5",
    },
    {
        label: "RIPEMD160",
        value: "6"
    },
    {
        label: "Keccak25",
        value: "25"
    },
    {
        label: "RIPEMD160_SHA256",
        value: "62"
    }
];

const HashCalculation = ({ processForm, closeModal }) => {
    const [generatedHash, setGeneratedHash] = useState(false);

    const handleFormSubmit = useCallback(async (values) => {
        const data = {
            secret: values.data,
            secretIsText: values.isMessage,
            hashAlgorithm: values.alg,
            feeATM: 0
        };

        processForm(data, 'hash', null, (res) => {
            setGeneratedHash(res.hash);
        });
    }, [processForm]);

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
