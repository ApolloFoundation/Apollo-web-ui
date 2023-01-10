import React from 'react';

import NummericInput from '../../../components/form-components/NumericInput';
import TextualInput from '../../../components/form-components/textual-input/textual-input1';


const Form = ({ goods, formatTimestamp }) => (
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
                    label="Current quantity:" 
                    text={goods.quantity}
                />
                <NummericInput
                    label="New quantity"
                    name="quantity"
                    placeholder="New quantity"
                    defaultValue={1}
                />
            </>
        }
    </>
);

export default Form;