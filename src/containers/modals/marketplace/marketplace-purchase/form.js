import React from 'react';

import {formatTimestamp} from '../../../../helpers/util/time'
import {connect} from 'react-redux';

import TextualInput from '../../../components/form-components/textual-input';
import NumericInput from '../../../components/form-components/numeric-input';

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
                    label="Quantity:" 
                    text={goods.quantity ? goods.quantity : "0"}
                />
                <TextualInput
                    setValue={setValue}
                    label="Current price:" 
                    text={`${(goods.priceATM / 100000000).toLocaleString('en')} APL`}
                />
                <NumericInput
                    setValue={setValue}
                    label="New quantity"
                    field="quantity"
                    placeholder="Quantity"
                    defaultValue={1}
                />
                <NumericInput
                    setValue={setValue}
                    label="Delivery deadline (hours)"
                    field="deliveryDeadlineTimestamp"
                    placeholder="Quantity"
                    defaultValue={168}
                />
            </>
        }
    </>
)

const md2p = {
    formatTimestamp
}

export default connect(null, md2p)(Form)