import React from 'react';
import { Form } from 'formik';
import Button from 'containers/components/button';
import NumericInput from 'containers/components/form-components/NumericInput';

export const BuyFormFields = ({ onChange, code, ticker, minimumSellRate, values }) => (
  <Form className="form-group-app">
    <NumericInput
      label="Units"
      name="units"
      type="float"
      placeholder="Units"
      onChange={onChange}
      counterLabel={code}
    />
    {!!minimumSellRate && (
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
    {!!minimumSellRate && (
      <NumericInput
        label="Effective Rate"
        name="effectiveRate"
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
      color="green"
      name={`Buy (${ticker} > ${code})`}
      disabled={!(+values.rateATM)}
    />
  </Form>
)