import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InputForm from '../../components/input-form';
import {Form, Text} from 'react-form';

import AccountRS from '../../components/account-rs';
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import {getBlockAction} from "../../../actions/blocks";

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
            sellRateATM: values.sellRateATM * Math.pow(10, 8),
            buyRateATM: values.buyRateATM * Math.pow(10, 8),
            initialSellSupply: values.initialSellSupply * Math.pow(10, this.props.modalData.decimals)
        };

        const res = await this.props.submitForm(null, null, values, 'publishExchangeOffer');
        if (res.errorCode) {
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
    };

    getBlock = async (reqParams) => {
        const block = await this.props.getBlockAction(reqParams);
        if (block) {
            this.setState({ block })
        }
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            {
                                this.props.modalData &&

                                <div className="form-group-app">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                    <div className="form-title">
                                        <p>Offer Currency</p>
                                    </div>
                                    <Text
                                        type="hidden"
                                        className="form-control"
                                        field="currency"
                                        placeholder="Account"
                                        defaultValue={this.props.modalData.currency}
                                        aria-describedby="amountText"/>

                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Currency {this.props.modalData.code}
                                        </label>
                                        <div className="col-sm-9">
                                            <span>
                                                {(this.props.modalData.maxSupply - this.props.modalData.currentSupply) === 0
                                                ? "None Available"
                                                : `Currency units available ${(this.props.modalData.maxSupply - this.props.modalData.currentSupply)}`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Buy units (Initial)
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent">
                                            <InputForm
                                                type={"number"}
                                                field="initialBuySupply"
                                                placeholder="Account"
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
                                                type={"number"}
                                                field="totalBuyLimit"
                                                placeholder="Account"
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
                                                type={"number"}
                                                field="buyRateATM"
                                                placeholder="Account"
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
                                                type={"number"}
                                                field="initialSellSupply"
                                                placeholder="Account"
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
                                                type={"number"}
                                                field="totalSellLimit"
                                                placeholder="Account"
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
                                                type={"number"}
                                                field="sellRateATM"
                                                placeholder="Account"
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
                                                    type={"number"}
                                                    field="expirationHeight"
                                                    placeholder="Finish height"
                                                    defaultValue={this.state.block.height}
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
                                        <label htmlFor="feeATM" className="col-sm-3 col-form-label">
                                            Fee
                                            <span
                                                onClick={async () => {
                                                    setValue("feeATM", 1);
                                                }
                                                }
                                                style={{paddingRight: 0}}
                                                className="calculate-fee"
                                            >
                                            Calculate
                                        </span>
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                            <Text defaultValue={(this.props.modalData && this.props.modalData.feeATM) ? this.props.modalData.feeATM : ''}
                                                  id="feeATM"
                                                  field="feeATM"
                                                  className="form-control"
                                                  value={this.state.feeATM}
                                                  placeholder="Amount"
                                                  type={"number"}
                                                  aria-describedby="feeATMText" />
                                            <div className="input-group-append">
                                                <span className="input-group-text" id="feeATMText">Apollo</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Secret Phrase
                                        </label>
                                        <div className="col-sm-9 mb-0 no-left-padding">
                                            <Text className="form-control" field="secretPhrase" placeholder="Secret Phrase" type={'password'}/>
                                        </div>
                                    </div>

                                    <AdvancedSettings
                                        setValue={setValue}
                                        getFormState={getFormState}
                                        values={values}
                                        advancedState={this.state.advancedState}
                                    />

                                    <div className="btn-box align-buttons-inside absolute right-conner">
                                        <button
                                            type="submit"
                                            name={'closeModal'}
                                            className="btn btn-right blue round round-bottom-right"
                                        >
                                            Publish Exchange Offer
                                        </button>
                                        <a onClick={() => this.props.closeModal()} className="btn btn-right round round-top-left">Cancel</a>
                                    </div>
                                    <div className="btn-box align-buttons-inside absolute left-conner">
                                        <a
                                            onClick={this.handleAdvancedState}
                                            className="btn btn-left round round-bottom-left round-top-right"
                                        >
                                            {this.state.advancedState ? "Basic" : "Advanced"}
                                        </a>
                                    </div>
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
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getBlockAction: (reqParams) => dispatch(getBlockAction(reqParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OfferCurrency);
