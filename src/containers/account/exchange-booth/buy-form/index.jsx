import React from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import { ONE_APL } from '../../../../constants';
import CustomButtom from '../../../components/button';
import NummericInput from '../../../components/form-components/numeric-input1';

export default function BuyForm(props) {
  const { code, minimumSellRate, decimals } = props;
  const { values, setValue } = useFormikContext();

  return (
    <Formik
      initialValues={{}}
      onSubmit={this.handleMinimumBuyRate}
    >
      <Form className="form-group-app">
        <NummericInput
          label="Units"
          name="units"
          type="float"
          placeholder="Units"
          onChange={e => {
            if (!e.target) {
              setValue('rateATM', Math.round(
                ((minimumSellRate / ONE_APL) * (10 ** decimals)) * +e,
              ));
            } else {
              setValue('rateATM', Math.round(((minimumSellRate / ONE_APL) * (10 ** decimals)) * +values.units));
            }
          }}
          counterLabel={code}
        />
        {!!minimumSellRate && (
          <NummericInput
            // value={Math.round((minimumSellRate / ONE_APL) * (10 ** decimals))}
            label="Maximum Rate"
            name="maximumRate"
            type="float"
            placeholder="Quantity"
            disableArrows
            disabled
            onChange={e => {
              if (!e.target) {
                setValue('rateATM', Math.round(
                  ((minimumSellRate / ONE_APL) * (10 ** decimals)) * +e,
                ));
              } else {
                setValue('rateATM', Math.round(
                  ((minimumSellRate / ONE_APL) * (10 ** decimals)) * +values.units,
                ));
              }
            }}
            counterLabel={`APL/${code}`}
          />
        )}
        {!!minimumSellRate && (
          <NummericInput
            // value={Math.round((minimumSellRate / ONE_APL) * (10 ** decimals))}
            label="Effective Rate"
            name="maximumRate"
            type="float"
            placeholder="Quantity"
            disableArrows
            disabled
            onChange={e => {
              if (!e.target) {
                setValue('rateATM', Math.round(
                  ((minimumSellRate / ONE_APL) * (10 ** decimals)) * +e,
                ));
              } else {
                setValue('rateATM', Math.round(
                  ((minimumSellRate / ONE_APL) * (10 ** decimals)) * +values.units,
                ));
              }
            }}
            counterLabel={`APL/${code}`}
          />
        )}
        <NummericInput
          label="Total"
          name="rateATM"
          type="tel"
          placeholder="Price"
          counterLabel="APL"
          disabled
        />
        <CustomButtom
          type="submit"
          size="lg"
          name={`Buy (APL > ${code})`}
          disabled={!(+values.rateATM)}
        />
      </Form>
    </Formik>
  );
}
