/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings';
import InputForm from '../../components/input-form';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import {Form, Text, TextArea, Number, Checkbox} from 'react-form';
import CustomSelect from '../../components/select';
import crypto from "../../../helpers/crypto/crypto";
import ModalFooter from '../../components/modal-footer';

import BackForm from '../modal-form/modal-form-container';
import BigInteger from "big-integer";

const algorithmData = [
    {
        label: "SHA256",
        value: "2"
    },
    {
        label: "SHA3",
        value: "3",
    },
    {
        label: "SCRYPT",
        value: "5",
    },
    {
        label: "Keccak25",
        value: "25"
    }
];

const typeValues = {
    1: 1,
    2: 2,
    3: 4,
    4: 8,
    5: 16,
    6: 32,
};

class IssueCurrency extends React.Component {
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

    handleFormSubmit = async values => {
        if (!values.secretPhrase || values.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }
        let type = 0;

        if (values.type1) type += typeValues[1];
        if (values.type2) type += typeValues[2];
        if (values.type3) type += typeValues[3];
        if (values.type4) type += typeValues[4];
        if (values.type5) type += typeValues[5];
        if (values.type6) type += typeValues[6];

        values = {
            name: values.name,
            code: values.code,
            description: values.description,
            minReservePerUnitATM: !values.type3 ? null : new BigInteger(values.minReservePerUnitATM).multiply(new BigInteger("" + Math.pow(10, values.decimals))),
            reserveSupply: !values.type3 ? null : values.reserveSupply * Math.pow(10, values.decimals),
            minDifficulty: !values.type5 ? null : values.minDifficulty,
            maxDifficulty: !values.type5 ? null : values.maxDifficulty,
            algorithm: !values.type5 ? null : values.algorithm,
            decimals: values.decimals,
            deadline: 1440,
            phased: false,
            issuanceHeight: values.height,
            publicKey: this.props.publicKey,
            feeAPL: values.feeAPL,
            maxSupply: values.maxSupply * Math.pow(10, values.decimals),
            initialSupply: values.initialSupply * Math.pow(10, values.decimals),
            secretPhrase: values.secretPhrase,
            type
        };
        this.setState({
            isPending: true
        });
        const res = await this.props.submitForm(values, 'issueCurrency');
        if (res.errorCode) {
            this.setState({
                isPending: false
            });
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Issue currency request has been submitted!', null, 5000);
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
                <BackForm
                    nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({submitForm, values, addValue, removeValue, setValue, getFormState}) => (

                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)}
                              onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>

                                <div className="form-title">
                                    {this.props.modalsHistory.length > 1 &&
                                    <div className={"backMy"} onClick={() => this.props.openPrevModal()}/>}
                                    <p>Issue Currency</p>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Currency Name
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            field="name"
                                            placeholder="Currency Name"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Currency Code
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            field="code"
                                            placeholder="Currency Code"
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
                                                  cols="30" rows="5"/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label align-self-start">
                                        Type
                                    </label>
                                    <div className="col-sm-9">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      defaultValue={true}
                                                      type="checkbox"
                                                      field="type1"/>
                                            <label className="form-check-label custom-control-label">
                                                Exchangeable
                                            </label>
                                        </div>
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="type2"/>
                                            <label className="form-check-label custom-control-label">
                                                Controllable
                                            </label>
                                        </div>
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="type3"/>
                                            <label className="form-check-label custom-control-label">
                                                Reservable
                                            </label>
                                        </div>
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      onChange={(value) => {
                                                          if (value) setValue('type3', true);
                                                      }}
                                                      field="type4"/>
                                            <label className="form-check-label custom-control-label">
                                                Claimable
                                            </label>
                                        </div>
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="type5"/>
                                            <label className="form-check-label custom-control-label">
                                                Mintable
                                            </label>
                                        </div>
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="type6"/>
                                            <label className="form-check-label custom-control-label">
                                                Non-Shuffleable
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {
                                    !!getFormState().values.type3 &&
                                    <React.Fragment>
                                        <div className="form-group row form-group-white mb-15">
                                            <label className="col-sm-3 col-form-label">
                                                Minimum Amount to Reserve Per Unit
                                            </label>
                                            <div className="col-sm-9">
                                                <InputForm
                                                    type="tel"
                                                    field="minReservePerUnitATM"
                                                    placeholder="Minimum Amount Per Unit"
                                                    setValue={setValue}/>
                                            </div>
                                        </div>
                                        <div className="form-group row form-group-white mb-15">
                                            <label className="col-sm-3 col-form-label">
                                                Reserve Supply
                                            </label>
                                            <div className="col-sm-9">
                                                <InputForm
                                                    type="tel"
                                                    field="reserveSupply"
                                                    placeholder="Number of Units"
                                                    setValue={setValue}/>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                }
                                {
                                    !!getFormState().values.type5 &&
                                    <React.Fragment>
                                        <div className="form-group row form-group-white mb-15">
                                            <label className="col-sm-3 col-form-label">
                                                Minimum Difficulty
                                            </label>
                                            <div className="col-sm-9">
                                                <InputForm
                                                    type="tel"
                                                    field="minDifficulty"
                                                    placeholder="Minimum Difficulty"
                                                    setValue={setValue}/>
                                            </div>
                                        </div>
                                        <div className="form-group row form-group-white mb-15">
                                            <label className="col-sm-3 col-form-label">
                                                Maximum Difficulty
                                            </label>
                                            <div className="col-sm-9">
                                                <InputForm
                                                    type="tel"
                                                    field="maxDifficulty"
                                                    placeholder="Maximum Difficulty"
                                                    setValue={setValue}/>
                                            </div>
                                        </div>
                                        <div className="form-group row form-group-white mb-15">
                                            <label className="col-sm-3 col-form-label">
                                                Algorithm
                                            </label>
                                            <div className="col-md-9">
                                                <CustomSelect
                                                    field={'algorithm'}
                                                    setValue={setValue}
                                                    defaultValue={algorithmData[0]}
                                                    options={algorithmData}
                                                />
                                            </div>
                                        </div>
                                    </React.Fragment>
                                }
                                {
                                    !!getFormState().values.type3 && 
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Initial Supply
                                        </label>
                                        <div className="col-sm-9">
                                            <Text
                                                type={'hidden'}
                                                field={'initialSupply'}
                                                defaultValue={0}    
                                            />
                                            <p>0</p>
                                        </div>
                                    </div> || 
                                        <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Initial Supply
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                type="tel"
                                                field="initialSupply"
                                                placeholder="Initial Supply"
                                                setValue={setValue}/>
                                        </div>
                                    </div>
                                }
                                
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Total Supply
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            type="tel"
                                            field="maxSupply"
                                            placeholder="Total Supply"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Decimals
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            type="tel"
                                            field="decimals"
                                            placeholder="Decimals"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Activation Height
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            type="tel"
                                            field="height"
                                            placeholder="Activation height"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Fee
                                        <span
                                            onClick={async () => {
                                                setValue("feeAPL", 25000);
                                            }
                                            }
                                            style={{paddingRight: 0}}
                                            className="calculate-fee"
                                        >
                                            Calculate
                                        </span>
                                    </label>
                                    <div
                                        className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
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
                                <ModalFooter
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                />
                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    {
                                        !!this.state.isPending ?
                                            <div
                                                style={{
                                                    width: 100
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
                                                    width: 100
                                                }}
                                                type="submit"
                                                name={'closeModal'}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                Issue currency
                                            </button>
                                    }
                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </a>

                                </div>
                                {/*<div className="btn-box align-buttons-inside absolute left-conner">*/}
                                {/*<a*/}
                                {/*onClick={this.handleAdvancedState}*/}
                                {/*className="btn btn-right round round-bottom-left round-top-right absolute"*/}
                                {/*style={{left : 0, right: 'auto'}}*/}
                                {/*>*/}
                                {/*{this.state.advancedState ? "Basic" : "Advanced"}*/}
                                {/*</a>*/}
                                {/*</div>*/}
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

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
    openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(IssueCurrency);
