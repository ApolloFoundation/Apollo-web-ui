import React from 'react';
import { useFormikContext } from 'formik';
import TextualInput from '../../../components/form-components/TextualInput';
import CustomSelect from '../../../components/form-components/CustomSelect';
import NumericInput from '../../../components/form-components/NumericInput';

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
                    defaultValue={typeData.find(type => type.value.currency === 'eth')}
                    options={typeData}
                    label='Wallet'
                    name='asset'
                    label="Wallet"
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
