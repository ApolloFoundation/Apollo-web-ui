import React from 'react';
import {connect} from 'react-redux';

import {formatTimestamp} from '../../../../helpers/util/time'

import TextualInput from '../../../components/form-components/textual-input';
import NumericInput from '../../../components/form-components/numeric-input';
import TextArea from '../../../components/form-components/text-area';
import { numberToLocaleString } from 'helpers/format';

const Form = ({setValue, goods, formatTimestamp, decimals, ticker}) => (
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
                    text={`${numberToLocaleString(goods.priceATM / decimals)} ${ticker}`}
                />
                <TextArea
                    setValue={setValue}
                    label="Data"
                    placeholder="Description"
                    field="goodsToEncrypt"
                />
                <NumericInput
                    setValue={setValue}
                    label="Discount"
                    field="discountATM"
                    placeholder="Discount"
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
