import React from 'react';
import {Form} from 'react-form';
import classNames from 'classnames';
import {connect} from 'react-redux';
import NummericInput from "../../../components/form-components/numeric-input";

const SellAsset = ({asset, handleTotalValue, handleSellOrders}) => (
    <div className={'card green'}>
        <div className="card-title card-title-lg d-flex justify-content-between align-items-center">
            Sell {asset.name}
            <span>Balance: {asset.balanceATU ? (asset.balanceATU / Math.pow(10, asset.decimals)).toLocaleString('en', {
                minimumFractionDigits: asset.decimals,
                maximumFractionDigits: asset.decimals
            }) : 0} {asset.name}</span>
        </div>
        <div className="card-body">
            <Form
                onSubmit={(values) => handleSellOrders(values)}
                render={({submitForm, values, addValue, removeValue, setValue, getFormState}) => (
                    <form onSubmit={submitForm}>
                        <div className="form-group-app">
                            <NummericInput
                                setValue={setValue}
                                label="Quantity"
                                field="quantity"
                                type={"tel"}
                                placeholder="Quantity"
                                onChange={value => handleTotalValue(setValue, value, values.priceATM)}
                                counterLabel={asset.name}
                            />
                            <NummericInput
                                setValue={setValue}
                                label="Price"
                                field="priceATM"
                                type={"tel"}
                                placeholder="Price"
                                onChange={value => handleTotalValue(setValue, value, values.quantity)}
                                counterLabel={`APL / ${asset.name}`}
                            />
                            <NummericInput
                                setValue={setValue}
                                label="Total"
                                field="total"
                                type={"tel"}
                                placeholder="Total"
                                counterLabel={asset.name}
                                disabled
                            />
                            <button
                                className={classNames({
                                    "btn btn-lg btn-green submit-button": true,
                                    "disabled": !values.total
                                })}
                            >
                                Sell ({asset.name} > APL)
                            </button>
                        </div>
                    </form>
                )}
            />
        </div>
    </div>
);

const mapStateToProps = state => ({
    amountATM: state.account.balanceATM,
    assetBalances: state.account.assetBalances
});

export default connect(mapStateToProps)(SellAsset);
