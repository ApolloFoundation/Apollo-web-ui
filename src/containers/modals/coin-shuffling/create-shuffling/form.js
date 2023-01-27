import React from 'react';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import CustomFormSelect from 'containers/components/select';
import NumericInputComponent from 'containers/components/form-components/NumericInput';
import { AssetInput } from 'containers/components/form-components/AssetInput';
import CurrencyInput from 'containers/components/form-components/CurrencyInput';
import BlockHeightInput from 'containers/components/form-components/BlockHeight/block-height-input1';
import { getTickerSelector } from 'selectors';


const holdingTypeData = [
    { value: 0, label: 'Apollo' },
    // { value: 1, label: 'Asset' },
    // { value: 2, label: 'Currency' },
];

const CreateShufflngForm = () => {
    const ticker = useSelector(getTickerSelector);

    const { values } = useFormikContext();

    return (
        <>
            <CustomFormSelect
                defaultValue={holdingTypeData[0]}
                options={holdingTypeData}
                label='Holding Type'
                name='holdingType'
            />
            <NumericInputComponent
                label='Amount'
                name='amount'
                countingTtile={ticker}
                placeholder='Amount'
                type='tel'
            />
            { values.holdingType === 1 && <AssetInput name='holding' /> }
            { values.holdingType === 2 && <CurrencyInput name='holding' /> }
            {
                (values.holdingType === 1 || values.holdingType === 2) &&
                <NumericInputComponent
                    label='Quantity'
                    name='amountATUf'
                    countingTtile=''
                    placeholder='Quantity'
                    type='tel'
                />
            }
            <BlockHeightInput
                label='Register Until'
                name='registrationPeriod'
                placeholder='Register Until'
            />
            <NumericInputComponent
                label='Participant Count'
                name='participantCount'
                placeholder='Participant Count'
                type='tel'
            />
        </>
    )
};

export default CreateShufflngForm;
