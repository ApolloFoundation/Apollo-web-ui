import React from 'react';
import { Form } from 'formik';
import Button from 'containers/components/button';
import NumericInput from 'containers/components/form-components/NumericInput';

export const SellFormFields = ({ onChange, code, ticker, minimumBuyRate, values }) => (
  <Form className="form-group-app">
    <NumericInput
      label="Units"
      name="units"
      type="float"
      placeholder="Units"
      onChange={onChange}
      counterLabel={code}
    />
    {!!minimumBuyRate && (
      <NumericInput
        label="Maximum Rate"
        name="maximumRate"
        type="float"
        placeholder="Quantity"
        disableArrows
        disabled
        onChange={onChange}
        counterLabel={`${ticker}/${code}`}
      />
    )}
    {Boolean(minimumBuyRate) && (
      <NumericInput
        label="Effective Rate"
        name="maximumRate"
        type="float"
        placeholder="Quantity"
        disableArrows
        disabled
        onChange={onChange}
        counterLabel={`${ticker}/${code}`}
      />
    )}
    <NumericInput
      label="Total"
      name="rateATM"
      type="tel"
      placeholder="Price"
      counterLabel={ticker}
      disabled
    />
    <Button
      type="submit"
      size="lg"
      name={`Buy (${code} > ${ticker})`}
      disabled={!(+values.rateATM)}
      color="green"
    />
  </Form>
);