/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InputForm from '../../components/input-form';
import {Form, Text} from 'react-form';

import AccountRS from '../../components/account-rs';
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import {getBlockAction} from "../../../actions/blocks";
import {getAccountCurrenciesAction} from "../../../actions/currencies";
import ModalFooter from '../../components/modal-footer';

import BackForm from '../modal-form/modal-form-container';

class OfferCurrency extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            block: null,
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

    }

    handleFormSubmit = async(values) => {

        values = {
            ...values,
            initialBuySupply: values.initialBuySupply * Math.pow(10, this.props.modalData.decimals),
            totalBuyLimit: values.totalBuyLimit * Math.pow(10, this.props.modalData.decimals),
            totalSellLimit: values.totalSellLimit * Math.pow(10, this.props.modalData.decimals),
            initialSellSupply: values.initialSellSupply * Math.pow(10, this.props.modalData.decimals),
            sellRateATM: values.sellRateATM * Math.pow(10, 8 - this.props.modalData.decimals),
            buyRateATM: values.buyRateATM   * Math.pow(10, 8 - this.props.modalData.decimals)
        };
        this.setState({
            isPending: true
        })
        const res = await this.props.submitForm( values, 'publishExchangeOffer');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Transfer asset request has been submitted!', null, 5000);
        }
    };

    handleAdvancedState = () => {
        if (this.state.advancedState) {
            this.setState({
                ...this.props,
                advancedState: false
            })
        } else {
            this.setState({
                ...this.props,
                advancedState: true
            })
        }
    };

    componentDidMount = () => {
        this.getBlock();
        this.getCurrency(this.props);
    };

    componentWillReceiveProps = (newState) => {
        this.getBlock();
        this.getCurrency(newState);
    };

    getBlock = async (reqParams) => {
        const block = await this.props.getBlockAction(reqParams);
        if (block) {
            this.setState({ block })
        }
    };

    getCurrency = async (newState) => {
        const currency = await this.props.getAccountCurrenciesAction({
            currency: this.props.modalData.currency,
            account: newState.account,
            includeCurrencyInfo: true
        });

        if (currency && currency.unconfirmedUnits) {
            this.setState({
                currencyAvailable : currency.unconfirmedUnits / Math.pow(10, currency.decimals)
            })
        } else {
            this.setState({
                currencyAvailable : null
            })
        }
    }

    render() {
        return (
            <div className="modal-box">
                <BackForm
	                nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)} onSubmit={submitForm}>
                            {
                                this.props.modalData &&

                                <div className="form-group-app">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                    <div className="form-title">
                                        {this.props.modalsHistory.length > 1 &&
                                        <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
                                        }
                                        <p>Offer Currency</p>
                                    </div>
                                    <Text
                                        type="hidden"
                                        className="form-control"
                                        field="currency"
                                        defaultValue={this.props.modalData.currency}
                                        aria-describedby="amountText"/>

                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Currency {this.props.modalData.code}
                                        </label>
                                        <div className="col-sm-9">
                                            <span>
                                                {!!(this.state.currencyAvailable)
                                                ? `Currency units available ${(this.state.currencyAvailable)}`
                                                : "None Available"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Buy units (Initial)
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent">
                                            <InputForm
                                                type={"tel"}
                                                field="initialBuySupply"
                                                placeholder="Amount"
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">{this.props.modalData.code}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Buy units (Limit)
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent">
                                            <InputForm
                                                type={"tel"}
                                                field="totalBuyLimit"
                                                placeholder="Amount"
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">{this.props.modalData.code}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Buy Rate per unit
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent">
                                            <InputForm
                                                type={"tel"}
                                                field="buyRateATM"
                                                placeholder="Amount"
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">{this.props.modalData.code} / APL</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Sell units (Initial)
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent">
                                            <InputForm
                                                type={"tel"}
                                                field="initialSellSupply"
                                                placeholder="Amount"
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">{this.props.modalData.code}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Sell units (Limit)
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent">
                                            <InputForm
                                                type={"tel"}
                                                field="totalSellLimit"
                                                placeholder="Amount"
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">{this.props.modalData.code}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Sell Rate per unit
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent">
                                            <InputForm
                                                type={"tel"}
                                                field="sellRateATM"
                                                placeholder="Amount"
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">{this.props.modalData.code} / APL</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">Expiration Height</label>
                                        <div className="col-sm-9 input-group">
                                            {
                                                this.state.block &&
                                                <InputForm
                                                    type={"tel"}
                                                    field="expirationHeight"
                                                    placeholder="Finish height"
                                                    defaultValue={this.state.block.height + 10000}
                                                    setValue={setValue}/>
                                            }
                                            <div className="input-group-append">
                                                {
                                                    this.state.block &&
                                                    <span className="input-group-text" id="finishHeightText">{this.state.block.height}</span>
                                                }
                                            </div>
                                        </div>
                                        {/*<div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                            2018/06/19 09:32 am
                                        </div>*/}
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Fee
                                            <span
                                                onClick={async () => {
                                                    setValue("feeAPL", 1);
                                                }}
                                                style={{paddingRight: 0}}
                                                className="calculate-fee"
                                            >
                                            Calculate
                                        </span>
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                            <InputForm
                                                field="feeAPL"
                                                defaultValue={(this.props.modalData && this.props.modalData.feeATM) ? this.props.modalData.feeATM : ''}
                                                placeholder="Minimum fee"
                                                type={"float"}
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">Apollo</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ModalFooter
                                        setValue={setValue}
                                        getFormState={getFormState}
                                        values={values}
                                    />

                                    <AdvancedSettings
                                        setValue={setValue}
                                        getFormState={getFormState}
                                        values={values}
                                        advancedState={this.state.advancedState}
                                    />

                                    <div className="btn-box align-buttons-inside absolute right-conner">

                                        {
                                            !!this.state.isPending ?
                                                <div
                                                    style={{
                                                        width: 156.25
                                                    }}
                                                    className="btn btn-right blue round round-bottom-right"
                                                >
                                                    <div className="ball-pulse">
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                    </div>
                                                </div> :
                                                <button
                                                    style={{
                                                        width: 156.25
                                                    }}
                                                    type="submit"
                                                    name={'closeModal'}
                                                    className="btn btn-right blue round round-bottom-right"
                                                >
                                                    Publish Exchange Offer
                                                </button>
                                        }
                                        <a onClick={() => this.props.closeModal()} className="btn btn-right round round-top-left">Cancel</a>
                                    </div>
                                    {/*<div className="btn-box align-buttons-inside absolute left-conner">*/}
                                        {/*<a*/}
                                            {/*onClick={this.handleAdvancedState}*/}
                                            {/*className="btn btn-left round round-bottom-left round-top-right"*/}
                                        {/*>*/}
                                            {/*{this.state.advancedState ? "Basic" : "Advanced"}*/}
                                        {/*</a>*/}
                                    {/*</div>*/}
                                </div>
                            }
                        </form>
                    )}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.account,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getBlockAction: (reqParams) => dispatch(getBlockAction(reqParams)),
    getAccountCurrenciesAction: (requestParams) => dispatch(getAccountCurrenciesAction(requestParams)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),

});

export default connect(mapStateToProps, mapDispatchToProps)(OfferCurrency);
