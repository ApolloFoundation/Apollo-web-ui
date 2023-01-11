import React from 'react';
import { useSelector} from 'react-redux';
import { useFormikContext } from 'formik';
import NumericInputComponent from '../../../components/form-components/NumericInput';
import AccountRSInput from '../../../components/form-components/AccountRS';
import { getBlockTimeSelector } from '../../../../selectors';


const LeaseBalanceForm = () => {
    const blockGenerationTime = useSelector(getBlockTimeSelector);
    const { values } = useFormikContext();

    const period  = parseInt(values && values.period ? values.period : 0);
    const avgTime = period ? Math.round((period * (blockGenerationTime ? blockGenerationTime : 10)) / 86400) : 0;

    return (
        <>
            <AccountRSInput
                label='Recipient'
                name='recipient'
                placeholder='Recipient'
            />
            <NumericInputComponent
                label='Period'
                name='period'
                placeholder='Period'
                defaultVallue={0}
                inputHint={`A lease of ${period} blocks is about ${avgTime} days.`}
            />
        </>
    )
}

export default LeaseBalanceForm;
