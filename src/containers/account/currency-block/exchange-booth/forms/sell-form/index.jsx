import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from '../../../../../../modules/modals';
import Button from '../../../../../components/button';
import NummericInput from '../../../../../components/form-components/numeric-input1';

export default function SellForm(props) {
  const dispatch = useDispatch();
  const ref = useRef({});

  const {
    minimumBuyRate, currencyInfo, balanceSell, ticker, currentCoinDecimals,
  } = props;

  const { code, decimals, currency } = currencyInfo;

  const handleMinimumSellRate = useCallback(values => {
    const normalizedValues = {
      ...values,
      code,
      currency,
      decimals,
    };

    if (!!parseInt(normalizedValues.rateATM, 10) && !!parseInt(normalizedValues.units, 10)) {
      dispatch(setBodyModalParamsAction('SELL_CURRENCY', normalizedValues));
    } else {
      NotificationManager.error('Please fill in number of units and rate.', null, 5000);
    }
  }, [code, currency, decimals, dispatch]);

  useEffect(() => {
    if (ref.current) {
      ref.current.setFieldValue('effectiveRate', Math.round((minimumBuyRate / currentCoinDecimals) * (10 ** decimals)))
      ref.current.setFieldValue('maximumRate', Math.round((minimumBuyRate / currentCoinDecimals) * (10 ** decimals)))
    }
  }, [minimumBuyRate, ref.current, decimals, currentCoinDecimals]);

  return (
    <div className="col-xl-6 col-md-12 pr-0 mb-3">
      <div className="card green">
        <div className="card-title card-title-lg">
          Sell
          {' '}
          {code}
          <span>
            Balance:
            {balanceSell.toLocaleString('en')}
            {' '}
            {code}
          </span>
        </div>
        <div className="card-body">
          <Formik
            initialValues={{
              maximumRate: Math.round((minimumBuyRate / currentCoinDecimals) * (10 ** decimals)),
              effectiveRate: Math.round((minimumBuyRate / currentCoinDecimals) * (10 ** decimals)),
              units: 0,
              rateATM: '',
            }}
            onSubmit={handleMinimumSellRate}
          >
            {({ values, setFieldValue }) => {
              ref.current.setFieldValue = setFieldValue;
              return (
                <Form className="form-group-app">
                  <NummericInput
                    label="Units"
                    name="units"
                    type="float"
                    placeholder="Units"
                    onChange={e => {
                      if (!e.target) {
                        setFieldValue('rateATM', Math.round(
                          ((minimumBuyRate / currentCoinDecimals) * (10 ** decimals)) * +e,
                        ));
                      } else {
                        setFieldValue('rateATM', Math.round(((minimumBuyRate / currentCoinDecimals) * (10 ** decimals)) * +values.units));
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
                          setFieldValue('rateATM', Math.round(
                            ((minimumBuyRate / currentCoinDecimals) * (10 ** decimals)) * +e,
                          ));
                        } else {
                          setFieldValue('rateATM', Math.round(
                            ((minimumBuyRate / currentCoinDecimals) * (10 ** decimals)) * +values.units,
                          ));
                        }
                      }}
                      counterLabel={`${ticker}/${code}`}
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
                          setFieldValue('rateATM', Math.round(
                            ((minimumBuyRate / currentCoinDecimals) * (10 ** decimals)) * +e,
                          ));
                        } else {
                          setFieldValue('rateATM', Math.round(
                            ((minimumBuyRate / currentCoinDecimals) * (10 ** decimals)) * +values.units,
                          ));
                        }
                      }}
                      counterLabel={`${ticker}/${code}`}
                    />
                  )}
                  <NummericInput
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
            )}}
          </Formik>
        </div>
      </div>
    </div>
  );
}
