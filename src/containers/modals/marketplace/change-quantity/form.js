import React from 'react';

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
                    label="Current quantity:" 
                    text={goods.quantity}
                />
                <NummericInput
                    setValue={setValue}
                    label="New quantity"
                    field="quantity"
                    placeholder="New quantity"
                    defaultValue={1}
                />
            </>
        }
    </>
);

export default Form;