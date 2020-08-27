import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { ONE_APL } from '../../../../constants';
import Button from '../../../components/button';
import NummericInput from '../../../components/form-components/numeric-input1';

export default function SellForm(props) {
  const dispatch = useDispatch();

  const { minimumBuyRate, currencyInfo, balanceSell } = props;

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
              maximumRate: Math.round((minimumBuyRate / ONE_APL) * (10 ** decimals)),
              effectiveRate: Math.round((minimumBuyRate / ONE_APL) * (10 ** decimals)),
            }}
            onSubmit={handleMinimumSellRate}
          >
            {({ values, setFieldValue }) => (
              <Form className="form-group-app">
                <NummericInput
                  label="Units"
                  name="units"
                  type="float"
                  placeholder="Units"
                  onChange={e => {
                    if (!e.target) {
                      setFieldValue('rateATM', Math.round(
                        ((minimumBuyRate / ONE_APL) * (10 ** decimals)) * +e,
                      ));
                    } else {
                      setFieldValue('rateATM', Math.round(((minimumBuyRate / ONE_APL) * (10 ** decimals)) * +values.units));
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
                          ((minimumBuyRate / ONE_APL) * (10 ** decimals)) * +e,
                        ));
                      } else {
                        setFieldValue('rateATM', Math.round(
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
                        setFieldValue('rateATM', Math.round(
                          ((minimumBuyRate / ONE_APL) * (10 ** decimals)) * +e,
                        ));
                      } else {
                        setFieldValue('rateATM', Math.round(
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
                <Button
                  type="submit"
                  size="lg"
                  name={`Buy (${code} > APL)`}
                  disabled={!(+values.rateATM)}
                  color="green"
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
