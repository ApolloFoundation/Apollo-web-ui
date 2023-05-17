import React from 'react';

import {Text} from 'react-form';
import AccountRsInput from '../../../components/form-components/account-rs';
import TextualInputComponent from '../../../components/form-components/textual-input';
import NumericInputComponent from '../../../components/form-components/numeric-input';
import CustomTextArea from '../../../components/form-components/text-area';

import {connect} from 'react-redux';

const TransferAsset = ({setValue, values, modalData}) => (
    <>
        <Text defaultValue={modalData.assetName} type="hidden" field={'name'}/>
        <Text defaultValue={modalData.assetID} type="hidden" field={'asset'}/>

        <TextualInputComponent
            isText
            label={'Asset'}
            text={`${modalData.assetName} - ${modalData.availableAssets} available`}
        />

        <AccountRsInput
            label={'Recipient'}
            field={'recipient'}
            setValue={setValue}
            defaultValue={values.recipient}
            value={values.recipient}
        />      

        <CustomTextArea
            label={'Comment'}
            field={'message'}
            placeholder={'Comment'}
            setValue={setValue}

        />
        
        <NumericInputComponent
            label={'Quantity'}
            placeholder={'Quantity'}
            field={'quantityATU'}
            defaultValue={modalData.quantityATU}
            setValue={setValue}
        />
    </>
)

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

export default connect(mapStateToProps)(TransferAsset);