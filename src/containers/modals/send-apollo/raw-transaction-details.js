/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {setModalData, setBodyModalParamsAction, setAlert, saveSendModalState, openPrevModal} from '../../../modules/modals';
import {sendTransactionAction} from '../../../actions/transactions';
import {calculateFeeAction} from "../../../actions/forms";
import InputForm from '../../components/input-form';
import crypto from  '../../../helpers/crypto/crypto';

import {Form, TextArea} from 'react-form';
import submitForm from "../../../helpers/forms/forms";

import BackForm from '../modal-form/modal-form-container';

class RawTransactionDetails extends React.Component {
    constructor(props) {
        super(props);

    }

    async handleFormSubmit(values) {
        let data = {
            feeATM: 0,
            transactionJSON: JSON.stringify({
                ...this.props.modalData.result.transactionJSON,
                signature: values.signature || ''
            })
        };

        const res = await this.props.submitForm( data, 'broadcastTransaction');
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Transaction has been submitted!', null, 5000);
        }
    }

    render() {
        const {request, result} = this.props.modalData;
        return (
            <div className="modal-box">
                <BackForm
	                nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, values, addValue, removeValue, setValue, getFormState
                    }) => (
                        <form className="modal-form modal-send-apollo" onChange={() => this.props.saveSendModalState(values)} onSubmit={submitForm}>
                            {request &&
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>

                                <div className="form-title">
	                                {this.props.modalsHistory.length > 1 &&
	                                <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
	                                }
                                    <p>Raw Transaction Details</p>
                                </div>
                                {(!result.signatureHash && result.unsignedTransactionBytes) &&
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label align-self-start">
                                        Unsigned Transaction Bytes
                                    </label>
                                    <div className="col-sm-9">
                                        <TextArea className="form-control"
                                                  defaultValue={result.unsignedTransactionBytes}
                                                  placeholder="Signed Transaction Bytes"
                                                  disabled={true}
                                                  field="unsignedTransactionBytes"
                                                  cols="30" rows="5"/>
                                    </div>
                                </div>
                                }
                                {result.transactionJSON &&
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label align-self-start">
                                        {result.signatureHash ?
                                            'Signed Transaction JSON'
                                            :
                                            'Unsigned Transaction JSON'
                                        }
                                    </label>
                                    <div className="col-sm-9">
                                        <TextArea className="form-control"
                                                  defaultValue={JSON.stringify(result.transactionJSON)}
                                                  placeholder="Transaction JSON"
                                                  disabled={true}
                                                  field="transactionJSON"
                                                  cols="30" rows="5"/>
                                    </div>
                                </div>
                                }
                                {(result.signatureHash && result.transactionBytes) &&
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label align-self-start">
                                        Signed Transaction Bytes
                                    </label>
                                    <div className="col-sm-9">
                                        <TextArea className="form-control"
                                                  defaultValue={result.transactionBytes}
                                                  placeholder="Signed Transaction Bytes"
                                                  disabled={true}
                                                  field="transactionBytes"
                                                  cols="30" rows="5"/>
                                    </div>
                                </div>
                                }
                                {result.fullHash &&
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Full Transaction Hash
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            defaultValue={result.fullHash}
                                            field="fullHash"
                                            disabled={true}
                                            placeholder="Full Transaction Hash"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                }
                                {result.signatureHash ?
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Signature Hash
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            defaultValue={result.signatureHash}
                                            field="signatureHash"
                                            disabled={true}
                                            placeholder="Signature Bytes"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                :
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label align-self-start">
                                        Signature
                                    </label>
                                    <div className="col-sm-9">
                                        <TextArea className="form-control"
                                                  placeholder="Signature"
                                                  field="signature"
                                                  cols="30" rows="5"/>
                                    </div>
                                </div>
                                }
                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className={`btn round round-top-left ${result.signatureHash ? 'round-bottom-right' : ''}`}
                                    >
                                        Close
                                    </a>
                                    {!result.signatureHash &&


                                        <button
                                            type="submit"
                                            name={'closeModal'}
                                            className="btn btn-right blue round round-bottom-right"
                                        >
                                            Broadcast
                                        </button>
                                    }
                                    {
                                        !!this.state.isPending ?
                                            <div
                                                style={{
                                                    width: 56.25
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
                                                    width: 56.25
                                                }}
                                                type="submit"
                                                name={'closeModal'}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                Broadcast
                                            </button>
                                    }

                                </div>
                            </div>
                            }
                        </form>
                    )}
                >

                </BackForm>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.account,
    publicKey: state.account.publicKey,
	modalsHistory: state.modals.modalsHistory
});

const mapDispatchToProps = dispatch => ({
    setAlert: (status, message) => dispatch(setAlert(status, message)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    sendTransaction: (requestParams) => dispatch(sendTransactionAction(requestParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams)),
	saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(RawTransactionDetails);
