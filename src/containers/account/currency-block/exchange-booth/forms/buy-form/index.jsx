import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from '../../../../../../modules/modals';
import Button from '../../../../../components/button';
import NumericInput from '../../../../../components/form-components/numeric-input1';
import { numberToLocaleString } from 'helpers/format';

export default function BuyForm(props) {
  const dispatch = useDispatch();

  const {
    minimumSellRate, currencyInfo, balanceBuy, currentCoinDecimals, ticker,
  } = props;

  const { code, decimals, currency } = currencyInfo;

  const handleMinimumBuyRate = useCallback(values => {
    const normalizedValues = {
      ...values,
      code,
      currency,
      decimals,
    };

    if (!!parseInt(normalizedValues.rateATM, 10) && !!parseInt(normalizedValues.units, 10)) {
      dispatch(setBodyModalParamsAction('BUY_CURRENCY', normalizedValues));
    } else {
      NotificationManager.error('Please fill in number of units and rate.', null, 5000);
    }
  }, [code, currency, decimals, dispatch]);

  return (
    <div className="col-xl-6 col-md-12 pr-0 mb-3">
      <div className="card green">
        <div className="card-title card-title-lg">
          Buy
          {' '}
          {code}
          <span>
            Balance:
            {' '}
            {numberToLocaleString(balanceBuy)}
            {' '}
            {ticker}
          </span>
        </div>
        <div className="card-body">
          <Formik
            initialValues={{
              maximumRate: Math.round((minimumSellRate / currentCoinDecimals) * (10 ** decimals)),
              effectiveRate: Math.round((minimumSellRate / currentCoinDecimals) * (10 ** decimals)),
              units: 0,
              rateATM: '',
            }}
            onSubmit={handleMinimumBuyRate}
          >
            {({ values, setFieldValue }) => (
              <Form className="form-group-app">
                <NumericInput
                  label="Units"
                  name="units"
                  type="float"
                  placeholder="Units"
                  onChange={e => {
                    if (!e.target) {
                      setFieldValue('rateATM', Math.round(
                        ((minimumSellRate / currentCoinDecimals) * (10 ** decimals)) * +e,
                      ));
                    } else {
                      setFieldValue('rateATM', Math.round(((minimumSellRate / currentCoinDecimals) * (10 ** decimals)) * +values.units));
                    }
                  }}
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
                    onChange={e => {
                      if (!e.target) {
                        setFieldValue('rateATM', Math.round(
                          ((minimumSellRate / currentCoinDecimals) * (10 ** decimals)) * +e,
                        ));
                      } else {
                        setFieldValue('rateATM', Math.round(
                          ((minimumSellRate / currentCoinDecimals) * (10 ** decimals)) * +values.units,
                        ));
                      }
                    }}
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
                    onChange={e => {
                      if (!e.target) {
                        setFieldValue('rateATM', Math.round(
                          ((minimumSellRate / currentCoinDecimals) * (10 ** decimals)) * +e,
                        ));
                      } else {
                        setFieldValue('rateATM', Math.round(
                          ((minimumSellRate / currentCoinDecimals) * (10 ** decimals)) * +values.units,
                        ));
                      }
                    }}
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
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
