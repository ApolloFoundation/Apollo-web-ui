import React from 'react';
import AccountRsInput from '../../../components/form-components/AccountRS';
import TextualInputComponent from '../../../components/form-components/TextualInput';
import NumericInputComponent from '../../../components/form-components/NumericInput';
import CustomTextArea from '../../../components/form-components/TextArea/TextAreaWithFormik';
import CustomInput from '../../../components/custom-input';

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