import React from 'react';
import NummericInput from 'containers/components/form-components/NumericInput';
import TextualInput from 'containers/components/form-components/TextualInput';

const Form = ({ goods, formatTimestamp, decimals, ticker }) => (
    <>
        {
            goods &&
            <>
                <TextualInput
                    label="Date:"
                    text={formatTimestamp(goods.timestamp)}
                />
                <TextualInput
                    label="Seller:"
                    text={goods.sellerRS}
                />
                <TextualInput
                    label="Quantity:"
                    text={goods.quantity}
                />
                <TextualInput
                    label="Current price:"
                    text={`${(goods.priceATM / decimals).toLocaleString('en')} ${ticker}`}
                />
                <NummericInput
                    label="New price"
                    name="priceATM"
                    placeholder="New price"
                    countingTtile={ticker}
                />
            </>
        }
    </>
);

export default Form;
