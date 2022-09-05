/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {openPrevModal, saveSendModalState, setBodyModalParamsAction, setModalData} from '../../../modules/modals';

import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import crypto from "../../../helpers/crypto/crypto";
import ModalFooter from '../../components/modal-footer';
import FeeCalc from '../../components/form-components/fee-calc';

import BackForm from '../modal-form/modal-form-container';
import classNames from "classnames";

class DeleteAccountProperty extends React.Component {
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
            const res = await this.props.submitForm(values, 'deleteAccountProperty');
            if (res && res.errorCode) {
                NotificationManager.error(res.errorDescription, 'Error', 5000)
            } else {
                this.props.setBodyModalParamsAction(null, {});
                NotificationManager.success('Account property has been deleted!', null, 5000);
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
                                <button type="button" onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></button>

                                <div className="form-title">
                                    {this.props.modalsHistory.length > 1 &&
                                    <div className={"backMy"} onClick={() => {
                                        this.props.openPrevModal()
                                    }}/>
                                    }
                                    <p>Delete Account Property</p>
                                </div>
                                <div className="form-group mb-15">
                                    <label>
                                        Setter
                                    </label>
                                    <div>
                                        <span>
                                            {(this.props.modalData && this.props.modalData.setterRS) ? this.props.modalData.setterRS : '-'}
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group mb-15">
                                    <label>
                                        Recipient
                                    </label>
                                    <div>
                                        <span>
                                            {(this.props.modalData && this.props.modalData.recipientRS) ? this.props.modalData.recipientRS : '-'}
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group mb-15">
                                    <label>
                                        Property
                                    </label>
                                    <div>
                                        <span>
                                            {(this.props.modalData && this.props.modalData.property) ? this.props.modalData.property : '-'}
                                        </span>
                                    </div>
                                </div>
                                <FeeCalc
                                    values={getFormState().values}
                                    setValue={setValue}
                                    requestType={'setAccountInfo'}
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
                                        <span className={'button-text'}>Delete Property</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccountProperty);
