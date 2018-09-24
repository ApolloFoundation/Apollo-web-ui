import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../../modules/modals';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import AdvancedSettings from '../../../components/advanced-transaction-settings'
import InputForm from '../../../components/input-form';
import {Form, Text, TextArea, Number} from 'react-form';
import crypto from '../../../../helpers/crypto/crypto';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {setAlert} from "../../../../modules/modals";
import submitForm from "../../../../helpers/forms/forms";
import {calculateFeeAction} from "../../../../actions/forms";

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    setAlert: (type, message) => dispatch(setAlert(type, message)),
    validatePassphrase: (passPhrase) => dispatch(crypto.validatePassphrase(passPhrase)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams))
});

class ListProductForSale extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false,
            prePreviewImage: null
        }
    }

    handleFormSubmit = async(values) => {
        // Todo: finish form validating

        const res = await this.props.submitForm(null, null, values, 'dgsListing');
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Product has been listed!', null, 5000);
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

    _handleImageChange = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                ...this.state,
                file: file,
                imagePreviewUrl: reader.result
            });
        };

        if (file) reader.readAsDataURL(file)
    };

    calculateFee = async (values, setValue) => {
        const requestParams = {
            ...values,
            requestType: 'dgsListing',
            deadline: '1440',
            publicKey: this.props.publicKey,
            feeATM: 0,
            calculateFee: true,
        };
        const fee = await this.props.calculateFeeAction(requestParams);

        if (!fee.errorCode) {
            setValue("feeATM", fee.transactionJSON.feeATM / 100000000);
        } else {
            NotificationManager.error(fee.errorDescription, 'Error', 5000);
        }
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>List Product For Sale</p>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Name
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            field="name"
                                            placeholder="Name"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label align-self-start">
                                        Description
                                    </label>
                                    <div className="col-sm-9">
                                        <TextArea className="form-control" placeholder="Description" field="description" cols="30" rows="5" />
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Tags
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            field="tags"
                                            placeholder="Tags (categories)"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Price
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            type={"number"}
                                            field="priceATM"
                                            placeholder="Price"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Quantity
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            type={"number"}
                                            field="quantity"
                                            placeholder="Quantity"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Image
                                    </label>
                                    <div className="col-sm-9">
                                            <div className="iconned-input-field">
                                                <div className="input-group-app search">
                                                    <div className="iconned-input-field">
                                                        <div className="input-icon text"><i className="">Browse&hellip;</i></div>
                                                        <input
                                                            id="file"
                                                            type="file"
                                                            placeholder="Recipient"
                                                            onChange={(e) => {
                                                                e.preventDefault();

                                                                let reader = new FileReader();
                                                                let file = e.target.files[0];

                                                                reader.onloadend = () => {
                                                                    this.setState({
                                                                        ...this.state,
                                                                        file: file,
                                                                        imagePreviewUrl: reader.result
                                                                    });
                                                                };

                                                                setValue("messageIsText", false);
                                                                setValue("messageIsPrunable", true);

                                                                if(file) reader.readAsDataURL(file);

                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                            {/*<Text placeholder="Fee" field="feeATM" type="text"/>*/}
                                        </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <div className="col-sm-9 offset-sm-3">
                                            {
                                                !this.state.imagePreviewUrl &&
                                                <div className="no-image">
                                                    <i className="zmdi zmdi-image" />
                                                </div>
                                            }
                                            {
                                                this.state.imagePreviewUrl &&
                                                <img className="preview-image" src={this.state.imagePreviewUrl} alt=""/>
                                            }
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Fee
                                        <span
                                            onClick={() => this.calculateFee(getFormState().values, setValue)}
                                            style={{paddingRight: 0}}
                                            className="calculate-fee">Calculate</span>
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                        <InputForm
                                            field="feeATM"
                                            placeholder="Minimum fee"
                                            type={"float"}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">Apollo</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Passphrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>
                                    </label>
                                    <div className="col-sm-9">
                                        <Text className="form-control" field="secretPhrase" placeholder="Secret Phrase" type={'password'}/>
                                    </div>
                                </div>
                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Put for sale
                                    </button>
                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </a>

                                </div>
                                <div className="btn-box align-buttons-inside absolute left-conner">
                                    <a
                                        onClick={this.handleAdvancedState}
                                        className="btn btn-right round round-bottom-left round-top-right absolute"
                                        style={{left : 0, right: 'auto'}}
                                    >
                                        {this.state.advancedState ? "Basic" : "Advanced"}
                                    </a>
                                </div>
                                <AdvancedSettings
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                    advancedState={this.state.advancedState}
                                />
                            </div>
                        </form>
                    )}
                />

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListProductForSale);
