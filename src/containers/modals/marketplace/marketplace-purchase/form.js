import React from 'react';
import { connect } from 'react-redux';
import { formatTimestamp } from '../../../../helpers/util/time';
import TextualInput from '../../../components/form-components/textual-input';
import NumericInput from '../../../components/form-components/numeric-input';
import { numberToLocaleString } from 'helpers/format';

const Form = ({
  setValue, goods, formatTimestamp, decimals, ticker,
}) => (
  <>
    {goods && (
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
          text={goods.quantity ? goods.quantity : '0'}
        />
        <TextualInput
          setValue={setValue}
          label="Current price:"
          text={`${numberToLocaleString(goods.priceATM / decimals)} ${ticker}`}
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
    )}
  </>
);

const md2p = { formatTimestamp };

export default connect(null, md2p)(Form);
