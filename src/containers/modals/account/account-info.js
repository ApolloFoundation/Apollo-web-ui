/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {Text, TextArea} from 'react-form';
import classNames from "classnames";
import {NotificationManager} from "react-notifications";
import {openPrevModal, saveSendModalState, setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import submitForm from "../../../helpers/forms/forms";
import crypto from "../../../helpers/crypto/crypto";
import ModalFooter from '../../components/modal-footer';
import BackForm from '../modal-form/modal-form-container';
import NummericInputForm from "../../components/form-components/numeric-input";
import FeeInputForm from "../../components/form-components/fee-input";

class AccountInfo extends React.Component {
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

    handleFormSubmit = async (values) => {
        if (!this.state.isPending) {
            this.setState({isPending: true});

            const res = await this.props.submitForm(values, 'setAccountInfo');
            if (res && res.errorCode) {
                NotificationManager.error(res.errorDescription, 'Error', 5000)
            } else {
                this.props.setBodyModalParamsAction(null, {});
                NotificationManager.success('Account info has been submitted!', null, 5000);
            }
            this.setState({isPending: false});
        }
    };

    handleAdvancedState = () => {
        this.setState({
            advancedState: !this.state.advancedState
        });
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
                            {
                                this.props.modalData &&
                                <div className="form-group-app">
                                    <button type="button" onClick={() => this.props.closeModal()} className="exit"><i
                                        className="zmdi zmdi-close"/></button>

                                    <div className="form-title">
                                        {this.props.modalsHistory.length > 1 &&
                                        <div className={"backMy"} onClick={() => {
                                            this.props.openPrevModal()
                                        }}></div>
                                        }
                                        <p>Set Account Info</p>
                                    </div>
                                    <div className="form-group mb-15">
                                        <label>Name</label>
                                        <div>
                                            <Text className={"form-control"} placeholder={'Your name'} field={'name'}/>
                                        </div>
                                    </div>
                                    <div className="form-group mb-15">
                                        <label>Description</label>
                                        <div>
                                            <TextArea className={"form-control"} placeholder="Description" field="message"
                                                      cols="6" rows="10"/>
                                        </div>
                                    </div>
                                    <FeeInputForm
                                        field={'feeATM'}
                                        values={values}
                                        setValue={setValue}
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
                                            <span className={'button-text'}>Update Account Info</span>
                                        </button>
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
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
    openPrevModal: () => dispatch(openPrevModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);
