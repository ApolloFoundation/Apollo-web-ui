import React from 'react';
import TextualInput from 'containers/components/form-components/TextualInput';
import NumericInput from 'containers/components/form-components/NumericInput';
import TextArea from 'containers/components/form-components/TextArea/TextAreaWithFormik';
import { numberToLocaleString } from 'helpers/format';

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
                    text={`${numberToLocaleString(goods.priceATM / decimals)} ${ticker}`}
                />
                <TextArea
                    label="Data"
                    placeholder="Description"
                    name="goodsToEncrypt"
                />
                <NumericInput
                    label="Discount"
                    name="discountATM"
                    placeholder="Discount"
                />
            </>
        }
    </>
)

export default Form;
