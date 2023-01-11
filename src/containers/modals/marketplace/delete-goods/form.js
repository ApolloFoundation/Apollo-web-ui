import React from 'react';
import TextualInput from '../../../components/form-components/TextualInput';

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
            </>
        }
    </>
)

export default Form;