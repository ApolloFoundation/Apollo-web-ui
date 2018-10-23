/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import uuid from 'uuid';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import CustomSelect from '../../components/select';
import AdvancedSettings from '../../components/advanced-transaction-settings';
import InputForm from '../../components/input-form';
import {Form, Text, TextArea, Number, Radio, RadioGroup} from 'react-form';
import submitForm from "../../../helpers/forms/forms";
import {getBlockAction} from "../../../actions/blocks";
import {getCurrencyAction} from "../../../actions/currencies";
import {getAssetAction} from "../../../actions/assets";
import {NotificationManager} from "react-notifications";
import {calculateFeeAction} from "../../../actions/forms";
import crypto from "../../../helpers/crypto/crypto";
import ModalFooter from '../../components/modal-footer'

const votingModelData = [
    { value: 0, label: 'Vote by Account' },
    { value: 1, label: 'Vote by Account Balance' },
    { value: 2, label: 'Vote by Asset Balance' },
    { value: 3, label: 'Vote by Currency Balance' }
];

class CreatePoll extends React.Component {
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
        this.getCurrency = this.getCurrency.bind(this);
        this.getAsset = this.getAsset.bind(this);
    }

    componentDidMount() {
        this.setFinishHeight()
    }

    removeAnswer = (setValue, answers, index) => {
        if (answers && answers.length > 1) {
            answers.splice(index, 1);
            setValue('answers', answers);
        }
    };

    addAnswer = (setValue, answers) => {
        let arrItem = answers === undefined ? 0 : answers.length;
        if (answers === undefined) {
            setValue(`answers[${arrItem}]`, '');
            arrItem = 1;
        }
        setValue(`answers[${arrItem}]`, '');
    };

    setFinishHeight = async (setValue) => {
        const block = await this.props.getBlockAction();

        if (block) {
            this.setState({
                block
            });
        }
    };

    handleFormSubmit = async(values) => {
        const isPassphrase = await this.props.validatePassphrase(values.secretPhrase);

        this.setState({
            isPending: true
        })

        let resultAnswers = {};

        if (values.answers) {
            values.answers.forEach((el, index) => {
                if (index > 9) {
                    resultAnswers['option' + index] = el;
                } else {
                    resultAnswers['option0' + index] = el;
                }
            });
        } else {
            NotificationManager.error('Please write answers.', 'Error', 5000);
            return;
        }

        const res = await this.props.submitForm( {
            ...values,
            'create_poll_answers[]': values.answers[0],
            minBalanceModel: 0,
            minBalanceType: 0,
            ...resultAnswers
        }, 'createPoll');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Your vote has been created!', null, 5000);
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

    selectedBalanceType = (values) => {
        const type = values.minBalanceType || values.votingModel;
        switch (type) {
            case 0:
                return '(none)';
            case 1:
                return '(Apollo)';
            case 2:
                return '(Asset)';
            case 3:
                return '(Currency)';
        }
    };

    getCurrency = async (reqParams, setValue) => {
        const result = await this.props.getCurrencyAction(reqParams);

        if (result) {
            this.setState({ currency: result.currency });
            setValue('holding', result.currency);
            setValue('create_poll_ms_id', result.currency);
        } else {
            this.setState({ currency: '-' });
            setValue('holding', '');
            setValue('create_poll_ms_id', '');
        }
    };

    getAsset = async (reqParams, setValue) => {
        const result = await this.props.getAssetAction(reqParams);

        if (result) {
            this.setState({ asset: result.name });
            setValue('holding', reqParams.asset);
        } else {
            this.setState({ asset: 'Not Existing' });
            setValue('holding', '');
        }
    };

    handleVotingModel = (value, setValue) => {
        if (value !== 0) setValue('minBalanceType', 0);
        setValue('minBalanceModel', value);
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={
                        ({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                            <form
                                className="modal-form"
                                onSubmit={submitForm}
                            >
                                <div className="form-group-app">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                    <div className="form-title">
                                        <p>Create Poll</p>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Name
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                field="name"
                                                placeholder="Poll Name"
                                                setValue={setValue}/>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label align-self-start">
                                            Description
                                        </label>
                                        <div className="col-sm-9">
                                            <TextArea className="form-control"
                                                      placeholder="Description"
                                                      field="description"
                                                      cols="30" rows="5" />
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">Poll By</label>
                                        <div className="col-md-9">
                                            <CustomSelect
                                                field={'votingModel'}
                                                setValue={setValue}
                                                defaultValue={votingModelData[0]}
                                                options={votingModelData}
                                                onChange={(value) => this.handleVotingModel(value, setValue)}
                                            />
                                        </div>
                                    </div>
                                    {getFormState().values.minBalanceType === 2 ||
                                    getFormState().values.votingModel === 2 &&
                                        <div className="form-group row form-group-grey mb-15">
                                            <label className="col-sm-3 col-form-label">
                                                Asset
                                            </label>
                                            <div className="col-sm-9 input-group input-group-double input-group-text-transparent input-group-sm mb-0">
                                                <InputForm
                                                    field="create_poll_asset_id"
                                                    placeholder="Asset Id"
                                                    onChange={(asset) => this.getAsset({asset}, setValue)}
                                                    setValue={setValue}/>
                                                <div className="input-group-append">
                                                    <span className="input-group-text">{this.state.asset}</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {getFormState().values.minBalanceType === 3 ||
                                    getFormState().values.votingModel === 3 &&
                                        <div className="form-group row form-group-grey mb-15">
                                            <label className="col-sm-3 col-form-label">
                                                Currency
                                            </label>
                                            <div className="col-sm-9 input-group input-group-double input-group-text-transparent input-group-sm mb-0">
                                                <InputForm
                                                    field="create_poll_ms_code"
                                                    placeholder="Code"
                                                    onChange={(code) => this.getCurrency({code}, setValue)}
                                                    setValue={setValue}/>
                                                <div className="input-group-append">
                                                    <span className="input-group-text">ID: {this.state.currency}</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {/*{getFormState().values.votingModel === votingModelData[0].value &&
                                    <RadioGroup field={'minBalanceType'} defaultValue={0}>
                                        <div className="form-group row form-group-white">
                                            <label className="col-sm-3 col-form-label align-self-start">
                                                Min Balance Type
                                            </label>
                                            <div className="col-md-9">
                                                <div className="form-sub-actions">
                                                    <div
                                                        className="form-group-app no-padding-bottom"
                                                        style={{paddingTop: 0, paddingLeft: 0}}
                                                    >
                                                        <div
                                                            className="input-group-app align-middle display-block mb-3">
                                                            <Radio value={0}/>
                                                            <label style={{display: 'inline-block'}}>None</label>
                                                        </div>
                                                        <div
                                                            className="input-group-app align-middle display-block mb-3">
                                                            <Radio value={1}/>
                                                            <label style={{display: 'inline-block'}}>Account
                                                                Balance</label>
                                                        </div>
                                                        <div
                                                            className="input-group-app align-middle display-block mb-3">
                                                            <Radio value={2}/>
                                                            <label style={{display: 'inline-block'}}>Asset
                                                                Balance</label>
                                                        </div>
                                                        <div
                                                            className="input-group-app align-middle display-block mb-3">
                                                            <Radio value={3}/>
                                                            <label style={{display: 'inline-block'}}>Currency
                                                                Balance</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                    }
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Min voting balance {this.selectedBalanceType(getFormState().values)}
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                disabled={getFormState().values.minBalanceType === 0 &&
                                                            getFormState().values.votingModel === 0}
                                                field="minBalance"
                                                placeholder=""
                                                type={"number"}
                                                defaultValue={0}
                                                setValue={setValue}/>
                                        </div>
                                    </div>*/}
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">Finish height</label>
                                        <div className="col-sm-9 input-group input-group-sm mb-0" onLoad={(setValue) => {this.setFinishHeight(setValue)}}>
                                            {
                                                this.state.block &&
                                                <InputForm
                                                    type="number"
                                                    field="finishHeight"
                                                    defaultValue={parseInt(this.state.block.height) + 10000}
                                                    placeholder="Finish height"
                                                    setValue={setValue}/>
                                            }

                                            <div className="input-group-append">
                                                {
                                                    this.state.block &&
                                                    <span className="input-group-text">{this.state.block.height}</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-0">
                                        <label className="col-sm-3 col-form-label align-self-start">
                                            Answer
                                        </label>
                                        <div className="col-sm-9">
                                            <div className="input-group input-group-sm mb-15 no-left-padding">
                                                <Text
                                                    field={'answers[0]'}
                                                    className="form-control"
                                                    placeholder={'Answer'}
                                                />
                                                <div className="input-group-append"
                                                     onClick={() => this.removeAnswer(setValue, getFormState().values.answers, 0)}>
                                                                    <span className="input-group-text">
                                                                        <i className="zmdi zmdi-minus-circle" />
                                                                    </span>
                                                </div>
                                            </div>
                                            {getFormState().values.answers &&
                                                getFormState().values.answers.map((el, index) => {
                                                    if(index !== 0 ) {
                                                        const filed = `answers[${index}]`;
                                                        return (
                                                            <div key={filed}
                                                                className="input-group input-group-sm mb-15 no-left-padding">
                                                                <Text
                                                                    field={filed}
                                                                    className="form-control"
                                                                    placeholder={'Answer'}
                                                                />
                                                                <div className="input-group-append"
                                                                     onClick={() => this.removeAnswer(setValue, getFormState().values.answers, index)}>
                                                                    <span className="input-group-text">
                                                                        <i className="zmdi zmdi-minus-circle"/>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="mobile-class form-group-grey row mb-15">
                                        <div className="col-sm-9 offset-sm-3">
                                            <a className="no-margin btn static blue"
                                               onClick={() => this.addAnswer(setValue, getFormState().values.answers)}>
                                                Add answer
                                            </a>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label align-self-start">
                                            Minimum nr of choices
                                        </label>
                                        <div className="col-sm-3">
                                            <InputForm
                                                defaultValue={1}
                                                type="number"
                                                field="minNumberOfOptions"
                                                placeholder=""
                                                setValue={setValue}/>
                                        </div>
                                        <label className="col-sm-3 col-form-label align-self-start">
                                            Maximum nr of choices
                                        </label>
                                        <div className="col-sm-3">
                                            <InputForm
                                                defaultValue={1}
                                                type="number"
                                                field="maxNumberOfOptions"
                                                placeholder=""
                                                setValue={setValue}/>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label align-self-start">
                                            Minimum range value
                                        </label>
                                        <div className="col-sm-3">
                                            <InputForm
                                                defaultValue={0}
                                                type="number"
                                                field="minRangeValue"
                                                placeholder=""
                                                setValue={setValue}/>
                                        </div>
                                        <label className="col-sm-3 col-form-label align-self-start">
                                            Maximum range value
                                        </label>
                                        <div className="col-sm-3">
                                            <InputForm
                                                defaultValue={1}
                                                type="number"
                                                field="maxRangeValue"
                                                placeholder=""
                                                setValue={setValue}/>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Fee
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                            <InputForm
                                                defaultValue={(this.props.modalData && this.props.modalData.feeATM) ? this.props.modalData.feeATM : ''}
                                                field="feeAPL"
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
                                                        width: 126.25
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
                                                        width: 126.25
                                                    }}
                                                    type="submit"
                                                    name={'closeModal'}
                                                    className="btn btn-right blue round round-bottom-right"
                                                >
                                                    Create poll
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
                                    </div>
                                    <AdvancedSettings
                                        setValue={setValue}
                                        getFormState={getFormState}
                                        values={values}
                                        advancedState={this.state.advancedState}
                                    />*/}
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
    getBlockAction: (data) => dispatch(getBlockAction(data)),
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams)),
    getCurrencyAction: (requestParams) => dispatch(getCurrencyAction(requestParams)),
    getAssetAction: (requestParams) => dispatch(getAssetAction(requestParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePoll);
