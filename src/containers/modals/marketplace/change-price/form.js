import React from 'react';

import {ONE_APL} from '../../../../constants';

import NummericInput from '../../../components/form-components/numeric-input';
import TextualInput from '../../../components/form-components/textual-input';


const Form = ({setValue, goods, formatTimestamp}) => (
    <>
        {
            goods &&
            <>
                <TextualInput
                    setValue={setValue}
                    label="Date:"
                    text={formatTimestamp(goods.timestamp)}
                />
                <TextualInput
                    setValue={setValue}
                    label="Seller:"
                    text={goods.sellerRS}
                />
                <TextualInput
                    setValue={setValue}
                    label="Quantity:"
                    text={goods.quantity}
                />
                <TextualInput
                    setValue={setValue}
                    label="Current price:"
                    text={`${(goods.priceATM / ONE_APL).toLocaleString('en')} APL`}
                />
                <NummericInput
                    setValue={setValue}
                    label="New price"
                    field="priceATM"
                    placeholder="New price"
                    defaultValue={1}
                    countingTtile={'APL'}
                />
            </>
        }
    </>
);

export default Form;
