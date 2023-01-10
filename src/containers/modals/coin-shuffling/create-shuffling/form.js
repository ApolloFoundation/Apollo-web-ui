import React from 'react';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import CustomFormSelect from '../../../components/select/index1';
import NumericInputComponent from '../../../components/form-components/NumericInput';
import { AssetInput } from '../../../components/form-components/asset-input1';
import CurrencyInput from '../../../components/form-components/currency-input1';
import BlockHeightInput from '../../../components/form-components/BlockHeight/block-height-input1';
import { getTickerSelector } from '../../../../selectors';


const holdingTypeData = [
    { value: 0, label: 'Apollo' },
    // { value: 1, label: 'Asset' },
    // { value: 2, label: 'Currency' },
];

const CreateShufflngForm = (props) => {
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
