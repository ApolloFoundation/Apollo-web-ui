import React from 'react';
import { useFormikContext } from 'formik';
import TextualInput from 'containers/components/form-components/TextualInput';
import CustomSelect from 'containers/components/form-components/CustomSelect';
import NumericInput from 'containers/components/form-components/NumericInput';

export const WithdrawForm = ({ typeData }) => {
    const { values } = useFormikContext();
    const currencyFormat = values.asset?.currency?.toUpperCase();

    return (
        <>
            <TextualInput
                name="fromAddress"
                placeholder={`${currencyFormat} Wallet`}
                type="text"
                disabled
                label="From"
            />
            <TextualInput
                name="toAddress"
                placeholder={`${currencyFormat} Wallet`}
                type="text"
                label="To"
            />
            {values.asset && (
                <CustomSelect
                    options={typeData}
                    label='Wallet'
                    name='asset'
                />
            )}
            <NumericInput
                name="amount"
                placeholder="Amount"
                type="float"
                label="Amount"
                counterLabel={currencyFormat}
            />
        </>
    );
}
