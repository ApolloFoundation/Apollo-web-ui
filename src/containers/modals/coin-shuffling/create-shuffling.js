/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


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
import crypto from "../../../helpers/crypto/crypto";

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
        const isPassphrase = await this.props.validatePassphrase(values.secretPhrase);
        if (!isPassphrase) {
            NotificationManager.error('Incorrect Pass Phrase.', 'Error', 5000);
            return;
        }

        values = {
            ...values,
            registrationPeriod: 1439
        };

        // values.publicKey = await crypto.getPublicKeyAPL(this.props.account, true);
        // delete values.secretPhrase;
        this.setState({
            isPending: true
        })
        const res = await this.props.submitForm( values, 'shufflingCreate');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Shuffling Created!', null, 5000);
            const broadcast = await this.props.submitForm( {
                transactionBytes: res.transactionBytes || res.unsignedTransactionBytes,
                prunableAttachmentJSON: JSON.stringify({...(res.transactionJSON.attachment), "version.ShufflingCreation": 1})
            }, 'broadcastTransaction');
            if (broadcast.errorCode) {
                NotificationManager.error(broadcast.errorDescription, 'Error', 5000)
            } else {
                this.props.setBodyModalParamsAction('START_SHUFFLING', {broadcast});
            }
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


    getCurrency = async (reqParams, setValue) => {
        const result = await this.props.getCurrencyAction(reqParams);

        if (result) {
            this.setState({ currency: result.currency });
            setValue('holding', result.currency);
        } else {
            this.setState({ currency: '-' });
            setValue('holding', '');
        }
    };

    getAsset = async (reqParams, setValue) => {
        const result = await this.props.getAssetAction(reqParams);

        if (result) {
            this.setState({ asset: result.name });
            setValue('holding', reqParams.asset);
            setValue('shuffling_asset_decimals', result.decimals);
        } else {
            this.setState({ asset: 'Not Existing' });
            setValue('holding', '');
            setValue('shuffling_asset_decimals', '');
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
                                {getFormState().values.holdingType === 0 &&
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
                                }
                                {getFormState().values.holdingType === 1 &&
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Asset
                                    </label>
                                    <div className="col-sm-9 input-group input-group-double input-group-text-transparent input-group-sm mb-0">
                                        <InputForm
                                            field="assetId"
                                            placeholder="Asset Id"
                                            onChange={(asset) => this.getAsset({asset}, setValue)}
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
                                            onChange={(code) => this.getCurrency({code}, setValue)}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">ID: {this.state.currency}</span>
                                        </div>
                                    </div>
                                </div>
                                }
                                {(getFormState().values.holdingType === 1 ||
                                    getFormState().values.holdingType === 2) &&
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Quantity
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                defaultValue={0}
                                                field="amountATUf"
                                                placeholder="Quantity"
                                                type={"number"}
                                                setValue={setValue}/>
                                        </div>
                                    </div>
                                }
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
                                                placeholder="Register Until"
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
                                {/*<AdvancedSettings
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                    advancedState={this.state.advancedState}
                                />*/}
                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </a>
                                    {
                                        !!this.state.isPending ?
                                            <div
                                                style={{
                                                    width: 150
                                                }}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                <div className="ball-pulse-sync">
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div> :
                                            <button
                                                style={{
                                                    width: 150
                                                }}
                                                type="submit"
                                                name={'closeModal'}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                Create Shuffling
                                            </button>
                                    }
                                </div>
                                {/*<div className="btn-box align-buttons-inside absolute left-conner">
                                    <a
                                        onClick={this.handleAdvancedState}
                                        className="btn btn-right round round-bottom-left round-top-right absolute"
                                        style={{left : 0, right: 'auto'}}
                                    >
                                        {this.state.advancedState ? "Basic" : "Advanced"}
                                    </a>
                                </div>*/}
                            </div>
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
});

const mapDispatchToProps = dispatch => ({
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setModalData: (data) => dispatch(setModalData(data)),
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getCurrencyAction: (requestParams) => dispatch(getCurrencyAction(requestParams)),
    getAssetAction: (requestParams) => dispatch(getAssetAction(requestParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateShuffling);
