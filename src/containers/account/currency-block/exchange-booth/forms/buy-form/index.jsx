import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from '../../../../../../modules/modals';
import { BuyFormFields } from './form';

export default function BuyForm(props) {
  const dispatch = useDispatch();
  const ref = useRef({});

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

  const handleChage = (values, setFieldValue) => e => {
    if (!e.target) {
      setFieldValue('rateATM', Math.round(
        ((minimumSellRate / currentCoinDecimals) * (10 ** decimals)) * +e,
      ));
    } else {
      setFieldValue('rateATM', Math.round(((minimumSellRate / currentCoinDecimals) * (10 ** decimals)) * +values.units));
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.setFieldValue('effectiveRate', Math.round((minimumSellRate / currentCoinDecimals) * (10 ** decimals)))
      ref.current.setFieldValue('maximumRate', Math.round((minimumSellRate / currentCoinDecimals) * (10 ** decimals)))
    }
  }, [minimumSellRate, ref.current, decimals, currentCoinDecimals]);

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
            {balanceBuy.toLocaleString('en')}
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
            {({ values, setFieldValue }) => {
              ref.current.setFieldValue = setFieldValue;
              return (
                <BuyFormFields
                  onChange={handleChage(values, setFieldValue)}
                  code={code}
                  ticker={ticker}
                  minimumSellRate={minimumSellRate}
                  values={values}
                />
            )}}
          </Formik>
        </div>
      </div>
    </div>
  );
}
