import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { ONE_APL } from '../../../../constants';
import CustomButtom from '../../../components/button';
import NummericInput from '../../../components/form-components/numeric-input1';

export default function BuyForm(props) {
  const dispatch = useDispatch();

  const {
    code, minimumSellRate, decimals, currency, currencyInfo,
  } = props;

  const handleMinimumBuyRate = useCallback(values => {
    const normalizedValues = {
      ...values,
      code,
      currency,
      decimals: currencyInfo.decimals,
    };

    if (!!parseInt(normalizedValues.rateATM) && !!parseInt(normalizedValues.units)) {
      dispatch(setBodyModalParamsAction('BUY_CURRENCY', normalizedValues));
    } else {
      NotificationManager.error('Please fill in number of units and rate.', null, 5000);
    }
  }, [code, currency, currencyInfo.decimals, dispatch]);

  return (
    <Formik
      initialValues={{
        maximumRate: Math.round((minimumSellRate / ONE_APL) * (10 ** decimals)),
        effectiveRate: Math.round((minimumSellRate / ONE_APL) * (10 ** decimals)),
      }}
      onSubmit={handleMinimumBuyRate}
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
              label="Effective Rate"
              name="effectiveRate"
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
      )}

    </Formik>
  );
}
