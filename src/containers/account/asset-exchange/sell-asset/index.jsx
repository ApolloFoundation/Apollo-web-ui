import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-form';
import classNames from 'classnames';
import NummericInput from '../../../components/form-components/numeric-input';
import { numberToLocaleString } from 'helpers/format';

const SellAsset = ({
  asset, handleTotalValue, handleSellOrders, accountAsset, getFormApi, ticker,
}) => {
  const balance = !!accountAsset && !!accountAsset.unconfirmedQuantityATU ? (accountAsset.unconfirmedQuantityATU / (10 ** accountAsset.decimals)) : 0;

  return (
    <div className="card green">
      <div className="card-title card-title-lg d-flex justify-content-between align-items-center">
        Sell
        {' '}
        {asset.name}
        <span>
          Balance:
          {numberToLocaleString(balance, {
            minimumFractionDigits: asset.decimals,
            maximumFractionDigits: asset.decimals,
          })}
          {' '}
          {asset.name}
        </span>
      </div>
      <div className="card-body">
        <Form
          getApi={getFormApi}
          onSubmit={values => handleSellOrders(values)}
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
                  className={classNames({
                    'btn btn-lg btn-green submit-button': true,
                    disabled: !values.total,
                  })}
                >
                  {`Sell (${asset.name} > ${ticker})`}
                </button>
              </div>
            </form>
          )}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  amountATM: state.account.balanceATM,
  assetBalances: state.account.assetBalances,
});

export default connect(mapStateToProps)(SellAsset);
