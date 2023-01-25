import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-form';
import classNames from 'classnames';
import NummericInput from '../../../components/form-components/numeric-input';
import { numberToLocaleString } from '../../../../helpers/format';

const BuyAsset = ({
  balanceATM, asset, handleTotalValue, handleBuyOrders, getFormApi, decimals, ticker,
}) => (
  <div className="card green">
    <div className="card-title card-title-lg d-flex justify-content-between align-items-center">
      Buy
      {' '}
      {asset.name}
      <span>
        Balance:
        {numberToLocaleString(balanceATM / decimals, {
          minimumFractionDigits: asset.decimals,
          maximumFractionDigits: asset.decimals,
        })}
        {' '}
        {ticker}
      </span>
    </div>
    <div className="card-body">
      <Form
        getApi={getFormApi}
        onSubmit={values => handleBuyOrders(values)}
        render={({
          submitForm, values, addValue, removeValue, setValue, getFormState,
        }) => (
          <form onSubmit={submitForm}>
            <div className="form-group-app">
              <NummericInput
                setValue={setValue}
                label="Quantity"
                field="quantity"
                type="tel"
                placeholder="Quantity"
                onChange={value => handleTotalValue(setValue, value, values.priceATM)}
                counterLabel={asset.name}
              />
              <NummericInput
                setValue={setValue}
                label="Price"
                field="priceATM"
                type="tel"
                placeholder="Price"
                onChange={value => handleTotalValue(setValue, value, values.quantity)}
                counterLabel={`${ticker} / ${asset.name}`}
              />
              <NummericInput
                setValue={setValue}
                label="Total"
                field="total"
                type="tel"
                placeholder="Total"
                counterLabel={asset.name}
                disabled
              />
              <button
                type="submit"
                className={classNames({
                  'btn btn-lg btn-green submit-button': true,
                  disabled: !values.total,
                })}
              >
                <span className="button-text">
                  Buy (
                  {ticker}
                  {' > '}
                  {asset.name}
                  )
                </span>
              </button>
            </div>
          </form>
        )}
      />
    </div>
  </div>
);

const mapStateToProps = state => ({ balanceATM: state.account.balanceATM });

export default connect(mapStateToProps)(BuyAsset);
