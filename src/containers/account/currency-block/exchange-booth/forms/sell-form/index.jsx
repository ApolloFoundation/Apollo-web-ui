import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { NotificationManager } from 'react-notifications';
import { numberToLocaleString } from 'helpers/format';
import { setBodyModalParamsAction } from '../../../../../../modules/modals';
import { SellFormFields }from './form';

export default function SellForm(props) {
  const dispatch = useDispatch();
  const ref = useRef({});

  const {
    minimumBuyRate, currencyInfo, balanceSell, ticker, currentCoinDecimals,
  } = props;

  const { code, decimals, currency } = currencyInfo;

  const handleSubmit = useCallback(values => {
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

  const handleUnitChange = (values, setFieldValue) => e => {
    if (!e.target) {
      setFieldValue('rateATM', Math.round(
        ((minimumBuyRate / currentCoinDecimals) * (10 ** decimals)) * +e,
      ));
    } else {
      setFieldValue('rateATM', Math.round(
        ((minimumBuyRate / currentCoinDecimals) * (10 ** decimals)) * +values.units
      ));
    }
  }

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
            {numberToLocaleString(balanceSell)}
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
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => {
              ref.current.setFieldValue = setFieldValue;
              return (
                <SellFormFields
                  onChange={handleUnitChange(values, setFieldValue)}
                  code={code}
                  ticker={ticker}
                  minimumBuyRate={minimumBuyRate}
                  values={values}
                />
            )}}
          </Formik>
        </div>
      </div>
    </div>
  );
}
