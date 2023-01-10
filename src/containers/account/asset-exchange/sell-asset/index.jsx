import React from 'react';
import classNames from 'classnames';
import { useFormik, FormikProvider, Form } from 'formik';
import NumericInput from '../../../components/form-components/NumericInput'
const bigInteger = require('jsbn').BigInteger;

const SellAsset = ({ asset, accountAsset, ticker, onSubmit }) => {
  const balance = !!accountAsset && !!accountAsset.unconfirmedQuantityATU ? (accountAsset.unconfirmedQuantityATU / (10 ** accountAsset.decimals)) : 0;

  const formik = useFormik({
    initialValues: {
      quantity: '',
      priceATM: '',
      total: '',
    },
    onSubmit,
  })

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
          {`Sell ${asset.name}`}
          <span>
            Balance:
            {balance.toLocaleString('en', {
              minimumFractionDigits: asset.decimals,
              maximumFractionDigits: asset.decimals,
            })}
            {' '}
            {asset.name}
          </span>
        </div>
        <div className="card-body">
            <FormikProvider value={formik}>
              <Form>
                <div className="form-group-app">
                  <NumericInput
                    label="Quantity"
                    name="quantity"
                    type="tel"
                    placeholder="Quantity"
                    onChange={handleValue(formik.values.priceATM)}
                    counterLabel={asset.name}
                  />
                  <NumericInput
                    label="Price"
                    name="priceATM"
                    type="tel"
                    placeholder="Price"
                    onChange={handleValue(formik.values.quantity)}
                    counterLabel={`${ticker} / ${asset.name}`}
                  />
                  <NumericInput
                    label="Total"
                    name="total"
                    type="tel"
                    placeholder="Total"
                    counterLabel={asset.name}
                    disabled
                  />
                  <button
                    className={classNames({
                      'btn btn-lg btn-green submit-button': true,
                      disabled: !formik.values.total,
                    })}
                  >
                    {`Sell (${asset.name} > ${ticker})`}
                  </button>
                </div>
              </Form>
            </FormikProvider>
        </div>
      </div>
    </div>
  );
};

export default SellAsset;
