import React from 'react';

import CustomFormSelect from '../../../components/form-components/custom-form-select';
import NumericInputComponent from '../../../components/form-components/numeric-input';
import AssetInput from '../../../components/form-components/asset-input';
import CurrencyInput from '../../../components/form-components/currency-input';
import BlockHeightInput from '../../../components/form-components/block-height-input';


const holdingTypeData = [
    { value: 0, label: 'Apollo' },
    { value: 1, label: 'Asset' },
    { value: 2, label: 'Currency' },
];

const CreateShufflngForm = (props) => {

    const {setValue, getFormState} = props;
    const {values : {holdingType}} = getFormState()
    return (
        <>
            <CustomFormSelect
                defaultValue={holdingTypeData[0]}
                setValue={setValue}
                options={holdingTypeData}
                label={'Holding Type'}
                field={'holdingType'}
            />

            <NumericInputComponent
                setValue={setValue}
        
                label={'Amount'}
                field={'shufflingAmountAPL'}
                countingTtile={'Apollo'}
                placeholder={'Amount'}
                type={'tel'}
            />

            {
                holdingType === 1 &&
                <AssetInput
                    field={'assetId'}
                    setValue={setValue}
                />
            }
            {
                holdingType === 2 &&
                <CurrencyInput 
                    field={'shuffling_ms_code'}
                    setValue={setValue}
                />
            }
            {
                holdingType === 1 &&
                holdingType === 2 &&
                <NumericInputComponent
                    setValue={setValue}
                    label={'Quantity'}
                    field={'amountATUf'}
                    countingTtile={''}
                    placeholder={'Quantity'}
                    type={'tel'}
                />
            }
            <BlockHeightInput 
                setValue={setValue}
                label={'Register Until'}
                field={'finishHeight'}
                placeholder={'Register Until'}
            />
            <NumericInputComponent
                setValue={setValue}
                label={'Participant Count'}
                field={'participantCount'}
                countingTtile={''}
                placeholder={'Participant Count'}
                type={'tel'}
            />
        </>
    )
}

export default CreateShufflngForm;