import React from 'react';
import { useSelector } from 'react-redux';
import { useFormik, FormikProvider, Form } from 'formik';
import classNames from 'classnames';
import NumericInput from 'containers/components/form-components/NumericInput'
import { getBalanceATMSelector } from 'selectors';
const bigInteger = require('jsbn').BigInteger;

const BuyAsset = ({ asset, decimals, ticker, onSubmit }) => {
  const balanceATM = useSelector(getBalanceATMSelector)

  const formik = useFormik({
    initialValues: {
      quantity: '',
      priceATM: '',
      total: '',
    },
    onSubmit,
  });

  const handleValue = (v2) => (v1) => {
    if (v1 && v2) {
      let result = (new bigInteger(v1).multiply(new bigInteger(v2)));

      if (result && Array.isArray(result.value)) {
          result = result.value.reverse().reduce((a, b) => {
              return a.toString() + b.toString()
          });
      } 
      formik.setFieldValue('total', result.toString());
    } else {
      formik.setFieldValue('total', 0);
    }
  }

  return (
    <div className="col-xl-6 col-md-12 pr-0 pb-3">
      <div className="card green">
        <div className="card-title card-title-lg d-flex justify-content-between align-items-center">
          {`Buy ${asset.name}`}
          <span>
            Balance:
            {(balanceATM / decimals).toLocaleString('en', {
              minimumFractionDigits: asset.decimals,
              maximumFractionDigits: asset.decimals,
            })}
            {' '}
            {ticker}
          </span>
        </div>
        <div className="card-body">
              <FormikProvider value={formik}>
                <Form>
                  <div className="form-group-app">
                    <NumericInput
                      label="Quantity"
                      placeholder="Quantity"
                      type="tel"
                      name="quantity"
                      onChange={handleValue(formik.values.priceATM)}
                      counterLabel={asset.name}
                      classNameWrapper="mb-2"
                    />
                    <NumericInput
                      label="Price"
                      placeholder="Price"
                      type="tel"
                      name="priceATM"
                      onChange={handleValue(formik.values.quantity)}
                      counterLabel={`${ticker} / ${asset.name}`}
                      classNameWrapper="mb-2"
                    />
                    <NumericInput
                      label="Total"
                      placeholder="Total"
                      type="tel"
                      name="total"
                      counterLabel={asset.name}
                      disabled
                      classNameWrapper="mb-0"
                    />
                    <button
                      type="submit"
                      className={classNames({
                        'btn btn-lg btn-green submit-button': true,
                        disabled: !formik.values.total,
                      })}
                    >
                      <span className="button-text">
                        {`Buy ${ticker} > ${asset.name}`}
                      </span>
                    </button>
                  </div>
                </Form>
              </FormikProvider>
        </div>
      </div>
    </div>
  );
}

export default BuyAsset;
