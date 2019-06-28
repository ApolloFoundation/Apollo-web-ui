import React from 'react';

import {formatTimestamp} from '../../../../helpers/util/time'
import {connect} from 'react-redux';

import {ONE_APL} from '../../../../constants';

import TextualInput from '../../../components/form-components/textual-input';
import NumericInput from '../../../components/form-components/numeric-input';

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
                    text={goods.quantity ? goods.quantity : "0"}
                />
                <TextualInput
                    setValue={setValue}
                    label="Current price:"
                    text={`${(goods.priceATM / ONE_APL).toLocaleString('en')} APL`}
                />
                <NumericInput
                    setValue={setValue}
                    label="Quantity"
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
);

const md2p = {
    formatTimestamp
};

export default connect(null, md2p)(Form)
