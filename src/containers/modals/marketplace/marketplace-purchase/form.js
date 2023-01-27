import React from 'react';
import { connect } from 'react-redux';
import { formatTimestamp } from 'helpers/util/time';
import TextualInput from 'containers/components/form-components/TextualInput';
import NumericInput from 'containers/components/form-components/NumericInput';

const Form = ({
  goods, formatTimestamp, decimals, ticker,
}) => (
  <>
    {goods && (
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
          text={goods.quantity ? goods.quantity : '0'}
        />
        <TextualInput
          label="Current price:"
          text={`${(goods.priceATM / decimals).toLocaleString('en')} ${ticker}`}
        />
        <NumericInput
          label="Quantity"
          name="quantity"
          placeholder="Quantity"
        />
        <NumericInput
          label="Delivery deadline (hours)"
          name="deliveryDeadlineTimestamp"
          placeholder="Quantity"
        />
      </>
    )}
  </>
);

const md2p = { formatTimestamp };

export default connect(null, md2p)(Form);
