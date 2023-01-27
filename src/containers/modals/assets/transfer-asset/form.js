import React from 'react';
import AccountRsInput from 'containers/components/form-components/AccountRS';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import NumericInputComponent from 'containers/components/form-components/NumericInput';
import CustomTextArea from 'containers/components/form-components/TextArea/TextAreaWithFormik';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';

const TransferAsset = ({ modalData }) => (
    <>
        <CustomInput type="hidden" name='name'/>
        <CustomInput type="hidden" name='asset'/>
        <TextualInputComponent
            isText
            label='Asset'
            text={`${modalData.assetName} - ${modalData.availableAssets} available`}
        />
        <AccountRsInput label='Recipient' name='recipient' />
        <CustomTextArea label='Comment' name='message' placeholder='Comment' />
        <NumericInputComponent
            label='Quantity'
            placeholder='Quantity'
            name='quantityATU'
        />
    </>
)

export default TransferAsset;