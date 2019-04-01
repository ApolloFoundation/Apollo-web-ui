import React from 'react';

import {formatTimestamp} from '../../../../helpers/util/time'
import {connect} from 'react-redux';

import NummericInput from '../../../components/form-components/numeric-input';
import TextualInput from '../../../components/form-components/textual-input';


const Form = ({setValue, goods}) => (
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
                    placeholder="Quantity"
                    defaultValue={1}
                />
            </>
        }
    </>
)

const md2p = {
    formatTimestamp
}

export default connect(null, md2p)(Form)