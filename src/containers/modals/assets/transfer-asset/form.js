import React from 'react';
import AccountRsInput from '../../../components/form-components/account-rs1';
import TextualInputComponent from '../../../components/form-components/textual-input/textual-input1';
import NumericInputComponent from '../../../components/form-components/numeric-input1';
import CustomTextArea from '../../../components/form-components/text-area1';
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