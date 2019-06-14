import React from 'react';
import {Form} from 'react-form';
import classNames from 'classnames';
import {connect} from 'react-redux';
import NummericInput from "../../../components/form-components/numeric-input";
import {ONE_APL} from "../../../../constants";

const BuyAsset = ({balanceATM, asset, handleTotalValue, handleBuyOrders}) => (
    <div className={'card green'}>
        <div className="card-title card-title-lg d-flex justify-content-between align-items-center">
            Buy {asset.name}
            <span>Balance: {(balanceATM / ONE_APL).toLocaleString('en', {
                minimumFractionDigits: asset.decimals,
                maximumFractionDigits: asset.decimals
            })} APL</span>
        </div>
        <div className="card-body">
            <Form
                onSubmit={(values) => handleBuyOrders(values)}
                render={({submitForm, values, addValue, removeValue, setValue, getFormState}) => (
                    <form onSubmit={submitForm}>
                        <div className="form-group-app">
                            <NummericInput
                                setValue={setValue}
                                label="Quantity"
                                field="quantity"
                                type={"tel"}
                                placeholder="Quantity"
                                onChange={(value) => handleTotalValue(setValue, value, values.priceATM)}
                                counterLabel={asset.name}
                            />
                            <NummericInput
                                setValue={setValue}
                                label="Price"
                                field="priceATM"
                                type={"tel"}
                                placeholder="Price"
                                onChange={(value) => handleTotalValue(setValue, value, values.quantity)}
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
                                type="submit"
                                className={classNames({
                                    "btn btn-lg btn-green submit-button": true,
                                    "disabled": !values.total
                                })}
                            >
                                <span className={'button-text'}>Buy (APL > {asset.name})</span>
                            </button>
                        </div>
                    </form>
                )}
            />
        </div>
    </div>
);

const mapStateToProps = state => ({
    balanceATM: state.account.balanceATM
});

export default connect(mapStateToProps)(BuyAsset);
