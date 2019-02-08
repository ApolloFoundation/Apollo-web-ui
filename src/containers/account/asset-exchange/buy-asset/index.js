import React from 'react';
import {Form} from 'react-form';
import InputForm from '../../../components/input-form';
import classNames from 'classnames';
import {connect} from 'react-redux';

const BuyAsset = ({amountATM, asset, handleTotalValue, handleBuyOrders}) => (
    <Form
        onSubmit={(values) => handleBuyOrders(values)}
        render={({submitForm, values, addValue, removeValue, setValue, getFormState}) => (
            <form style={{height: 'auto'}}
                    className="card ballance card-medium medium-padding full-height h-100"
                    onSubmit={submitForm}
            >
                <div className="form-group-app">
                    <div className="form-title">
                        <p>Buy {  asset.name}</p>
                        <div className="form-sub-title">
                            balance: <strong>{(amountATM / Math.pow(10,   asset.decimals)).toLocaleString('en', {
                            minimumFractionDigits:   asset.decimals,
                            maximumFractionDigits:   asset.decimals
                        })} APL</strong>
                        </div>
                    </div>
                    <div
                        className="input-group-app offset-top display-block inline no-margin">
                        <div className="form-group row form-group-white">
                            <div className="col-md-3 pl-0">
                                <label>Quantity</label>
                            </div>
                            <div
                                className="col-md-9 pr-0 input-group input-group-text-transparent">
                                <InputForm
                                    field="quantity"
                                    placeholder="Quantity"
                                    type={"tel"}
                                    onChange={() => handleTotalValue(setValue, getFormState)}
                                    setValue={setValue}/>
                                <div className="input-group-append">
                                    <span className="input-group-text"
                                            id="amountText">{  asset.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="input-group-app offset-top display-block inline no-margin">
                        <div className="form-group row form-group-white">
                            <div className="col-md-3 pl-0">
                                <label>Price</label>
                            </div>
                            <div
                                className="col-md-9 pr-0 input-group input-group-text-transparent">
                                <InputForm
                                    field="priceATM"
                                    placeholder="Quantity"
                                    type={"tel"}
                                    onChange={() => handleTotalValue(setValue, getFormState)}
                                    setValue={setValue}/>
                                <div className="input-group-append">
                                    <span className="input-group-text"
                                            id="amountText">APL / {  asset.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="input-group-app offset-top display-block inline no-margin">
                        <div className="form-group row form-group-white">
                            <div className="col-md-3 pl-0">
                                <label>Total</label>
                            </div>
                            <div className="col-md-9 pr-0 input-group">
                                <InputForm
                                    field="total"
                                    placeholder="Price"
                                    type={"tel"}
                                    disabled={true}
                                    setValue={setValue}/>
                                <div className="input-group-append">
                                    <span className="input-group-text"
                                            id="amountText">{  asset.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="input-group-app offset-top display-block inline no-margin">
                        <div className="row form-group-white">
                            <div className="col-md-3 pl-0">
                            </div>
                            <div className="col-md-9 pr-0">
                                <button
                                    className={classNames({
                                        "btn": true,
                                        "static": true,
                                        "blue": true,
                                        "blue-disabled": !(!!getFormState().values.total)
                                    })}
                                >
                                    Buy (APL > {  asset.name})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )}
    />
)

const mapStateToProps = state => ({
    amountATM: state.account.balanceATM
})

export default connect(mapStateToProps)(BuyAsset);