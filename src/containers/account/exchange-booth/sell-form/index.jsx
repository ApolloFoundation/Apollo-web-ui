import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { ONE_APL } from '../../../../constants';
import CustomButtom from '../../../components/button';
import NummericInput from '../../../components/form-components/numeric-input1';

export default function SellForm(props) {
  const dispatch = useDispatch();

  const { minimumBuyRate, currency, currencyInfo } = props;

  const { code, decimals } = currencyInfo;

  const handleMinimumSellRate = useCallback(values => {
    const normalizedValues = {
      ...values,
      code,
      currency,
      decimals,
    };

    if (!!parseInt(normalizedValues.rateATM) && !!parseInt(normalizedValues.units)) {
      dispatch(setBodyModalParamsAction('SELL_CURRENCY', normalizedValues));
    } else {
      NotificationManager.error('Please fill in number of units and rate.', null, 5000);
    }
  }, [code, currency, decimals, dispatch]);

  return (
    <Formik
      initialValues={{
        maximumRate: Math.round((minimumBuyRate / ONE_APL) * (10 ** decimals)),
        effectiveRate: Math.round((minimumBuyRate / ONE_APL) * (10 ** decimals)),
      }}
      onSubmit={handleMinimumSellRate}
    >
      {({ values, setValue }) => (
        <Form className="form-group-app">
          <NummericInput
            label="Units"
            name="units"
            type="float"
            placeholder="Units"
            onChange={e => {
              if (!e.target) {
                setValue('rateATM', Math.round(
                  ((minimumBuyRate / ONE_APL) * (10 ** decimals)) * +e,
                ));
              } else {
                setValue('rateATM', Math.round(((minimumBuyRate / ONE_APL) * (10 ** decimals)) * +values.units));
              }
            }}
            counterLabel={code}
          />
          {!!minimumBuyRate && (
            <NummericInput
              label="Maximum Rate"
              name="maximumRate"
              type="float"
              placeholder="Quantity"
              disableArrows
              disabled
              onChange={e => {
                if (!e.target) {
                  setValue('rateATM', Math.round(
                    ((minimumBuyRate / ONE_APL) * (10 ** decimals)) * +e,
                  ));
                } else {
                  setValue('rateATM', Math.round(
                    ((minimumBuyRate / ONE_APL) * (10 ** decimals)) * +values.units,
                  ));
                }
              }}
              counterLabel={`APL/${code}`}
            />
          )}
          {!!minimumBuyRate && (
            <NummericInput
              label="Effective Rate"
              name="maximumRate"
              type="float"
              placeholder="Quantity"
              disableArrows
              disabled
              onChange={e => {
                if (!e.target) {
                  setValue('rateATM', Math.round(
                    ((minimumBuyRate / ONE_APL) * (10 ** decimals)) * +e,
                  ));
                } else {
                  setValue('rateATM', Math.round(
                    ((minimumBuyRate / ONE_APL) * (10 ** decimals)) * +values.units,
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
            name={`Buy (${code} > APL)`}
            disabled={!(+values.rateATM)}
          />
        </Form>
      )}
    </Formik>
  );
}
