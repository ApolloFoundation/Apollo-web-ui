/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {openPrevModal, saveSendModalState, setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import InputForm from '../../components/input-form';

import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import crypto from "../../../helpers/crypto/crypto";
import ModalFooter from '../../components/modal-footer'

import BackForm from '../modal-form/modal-form-container';
import AccountRSFormInput from "../../components/form-components/account-rs";
import classNames from "classnames";
import NummericInputForm from "../../components/form-components/numeric-input";

class SetAccountProperty extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,
            isPending: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

    }

    async handleFormSubmit(values) {
        if (!this.state.isPending) {
            this.setState({isPending: true});
            const {modalData, submitForm} = this.props;

            // Check if the property is already passed to modal window
            if (modalData && modalData.property) {
                values.property = modalData.property;
            }

            const res = await submitForm(values, 'setAccountProperty');
            if (res.errorCode) {
                NotificationManager.error(res.errorDescription, 'Error', 5000)
            } else {
                this.props.setBodyModalParamsAction(null, {});
                NotificationManager.success('Account property has been saved!', null, 5000);
            }
            this.setState({isPending: false});
        }
    }

    render() {
        return (
            <div className="modal-box">
                <BackForm
                    nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({submitForm, values, addValue, removeValue, setValue, getFormState, getValue}) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)}
                              onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>

                                <div className="form-title">
                                    {this.props.modalsHistory.length > 1 && (
                                        <div className={"backMy"} onClick={() => {
                                            this.props.openPrevModal()
                                        }}/>
                                    )}
                                    <p>{this.props.modalData.property ? 'Update' : 'Set'} Account Property</p>
                                </div>
                                {(this.props.modalData && this.props.modalData.recipientRS) ? (
                                    <div className="form-group mb-15">
                                        <label>
                                            Recipient
                                        </label>
                                        <div>
                                            <span>
                                                {this.props.modalData.recipientRS}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <AccountRSFormInput
                                        field={'recipient'}
                                        label={'Recipient'}
                                        setValue={setValue}
                                    />
                                )}
                                <div className="form-group mb-15">
                                    <label>
                                        Property
                                    </label>
                                    <div>
                                        {(this.props.modalData && this.props.modalData.property) ? (
                                            <span>{this.props.modalData.property}</span>
                                        ) : (
                                            <InputForm
                                                field="property"
                                                placeholder="Property"
                                                setValue={setValue}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="form-group mb-15">
                                    <label>
                                        Value
                                    </label>
                                    <div>
                                        <InputForm
                                            field="value"
                                            defaultValue={(this.props.modalData && this.props.modalData.value) ? this.props.modalData.value : ''}
                                            placeholder="Value"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <NummericInputForm
                                    field={'feeATM'}
                                    counterLabel={'Apollo'}
                                    type={'float'}
                                    label={'Fee'}
                                    setValue={setValue}
                                    placeholder={'Fee'}
                                    defaultValue={'1'}
                                />
                                <ModalFooter
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                />

                                <div className="btn-box right-conner align-right form-footer">
                                    <button
                                        type={'button'}
                                        onClick={() => this.props.closeModal()}
                                        className="btn btn-default mr-3"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className={classNames({
                                            "btn btn-green submit-button": true,
                                            "loading btn-green-disabled": this.state.isPending,
                                        })}
                                    >
                                        <div className="button-loader">
                                            <div className="ball-pulse">
                                                <div/>
                                                <div/>
                                                <div/>
                                            </div>
                                        </div>
                                        <span className={'button-text'}>Set Property</span>
                                    </button>
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
    modalData: state.modals.modalData,
    publicKey: state.account.publicKey,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
    openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SetAccountProperty);
