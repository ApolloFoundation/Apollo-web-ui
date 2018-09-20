import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings';
import InputForm from '../../components/input-form';
import AccountRS from '../../components/account-rs';
import CustomSelect from '../../components/select/';
import {Form, Text} from 'react-form';
import {getBlockAction} from "../../../actions/blocks";
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import {getAssetAction} from "../../../actions/assets";
import {getCurrencyAction} from "../../../actions/currencies";

const holdingTypeData = [
    { value: 0, label: 'Apollo' },
    { value: 1, label: 'Asset' },
    { value: 2, label: 'Currency' },
];

class CreateShuffling extends React.Component {
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

            currency: '-',
            asset: 'Not Existing',
        }

    }

    handleFormSubmit = async(values) => {

        values = {
            ...values,
            registrationPeriod: 1439
        };

        const res = await this.props.submitForm(null, null, values, 'shufflingCreate');
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Shuffling Created!', null, 5000);
        }

        // this.props.sendTransaction(values);
        // this.props.setBodyModalParamsAction(null, {});
        // this.props.setAlert('success', 'Transaction has been submitted!');
    };

    componentDidMount = () => {
        this.setRegisterUntil();
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

    setRegisterUntil = async () => {
        const block = await this.props.getBlockAction();

        if (block) {
            this.setState({
                block
            });
        }
    };


    getCurrency = async (reqParams) => {
        const result = await this.props.getCurrencyAction(reqParams);

        if (result) {
            this.setState({ currency: result.currency });
        } else {
            this.setState({ currency: '-' });
        }
    };

    getAsset = async (reqParams) => {
        const result = await this.props.getAssetAction(reqParams);

        if (result) {
            this.setState({ asset: result.name });
        } else {
            this.setState({ asset: 'Not Existing' });
        }
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, setValue, values, getFormState
                             }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Create shuffling</p>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label align-self-start">
                                        Holding Type
                                    </label>
                                    <div className="col-sm-9">
                                        <CustomSelect
                                            field={'holdingType'}
                                            setValue={setValue}
                                            defaultValue={holdingTypeData[0]}
                                            options={holdingTypeData}
                                        />
                                    </div>
                                </div>
                                {getFormState().values.holdingType === 1 &&
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Asset
                                    </label>
                                    <div className="col-sm-9 input-group input-group-double input-group-text-transparent input-group-sm mb-0">
                                        <InputForm
                                            field="holding"
                                            placeholder="Asset Id"
                                            onChange={(asset) => this.getAsset({asset})}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">{this.state.asset}</span>
                                        </div>
                                    </div>
                                </div>
                                }
                                {getFormState().values.holdingType === 2 &&
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Currency
                                    </label>
                                    <div className="col-sm-9 input-group input-group-double input-group-text-transparent input-group-sm mb-0">
                                        <InputForm
                                            field="shuffling_ms_code"
                                            placeholder="Code"
                                            onChange={(code) => this.getCurrency({code})}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">ID: {this.state.currency}</span>
                                        </div>
                                    </div>
                                </div>
                                }
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Amount
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                        <InputForm
                                            defaultValue={0}
                                            field="shufflingAmountAPL"
                                            placeholder="Amount"
                                            type={"number"}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">Apollo</span>
                                        </div>
                                    </div>
                                </div>
                                {
                                    this.state.block &&
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Register Until
                                        </label>
                                        <div className="col-sm-9 input-group input-group-sm">
                                            <InputForm
                                                defaultValue={this.state.block.height}
                                                field="finishHeight"
                                                placeholder="Amount"
                                                type={"number"}
                                                step={500}
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">{this.state.block.height}</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Participant Count
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <InputForm
                                            field="participantCount"
                                            type={"number"}
                                            placeholder="Participant Count"
                                            setValue={setValue}/>
                                    </div>
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
                                <AdvancedSettings
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                    advancedState={this.state.advancedState}
                                />
                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </a>
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Create Shuffling
                                    </button>

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
                            </div>
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
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    setModalData: (data) => dispatch(setModalData(data)),
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getCurrencyAction: (requestParams) => dispatch(getCurrencyAction(requestParams)),
    getAssetAction: (requestParams) => dispatch(getAssetAction(requestParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateShuffling);
