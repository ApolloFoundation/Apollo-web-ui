import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import {Form, Text} from 'react-form';

import AccountRS from '../../components/account-rs';
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";

class BuyAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
        console.log(this.props.modalData);
        values = {
            ...values,
            asset: this.props.modalData.assetInfo.asset,
            priceATM: this.props.modalData.priceATM,
            quantityATU: this.props.modalData.quantityATU * Math.pow(10, this.props.modalData.assetInfo.decimals)
        };

        const res = await this.props.submitForm(null, null, values, 'placeBidOrder');
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('The buy order has been submitted!', null, 5000);
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
                                        <p>Confirm Order (Buy)</p>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Order Description</label>
                                            </div>
                                            <div className="col-md-9">
                                                <p>Buy {this.props.modalData.quantityATU} {this.props.modalData.assetName} assets at {this.props.modalData.total / this.props.modalData.quantityATU} Apollo each.</p>
                                                <Text defaultValue={this.props.modalData.assetName} type="hidden" field={'name'}/>
                                                <Text defaultValue={this.props.modalData.assetID} type="hidden" field={'asset'}/>
                                                <Text defaultValue={this.props.modalData.quantityATU} placeholder={'Quantity'} type="hidden" field={'quantityATU'}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Total</label>
                                            </div>
                                            <div className="col-md-9">
                                                <p>{this.props.modalData.total} Apollo</p>
                                                <Text defaultValue={this.props.modalData.assetName} placeholder={'Quantity'} type="hidden" field={'quantityATU'}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Fee</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text defaultValue={this.props.modalData.assetName} placeholder={'Amount'} type="number" field={'feeATM'}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Secret Phrase</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text placeholder={'Secret Phrase'} type="password" field={'secretPhrase'}/>
                                            </div>
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
                                            Buy
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
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyAsset);
