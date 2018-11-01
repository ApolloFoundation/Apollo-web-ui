/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../modules/modals';
import InputForm from '../../components/input-form';
import InfoBox from '../../components/info-box';
import {Form, Text, TextArea} from 'react-form';
import AdvancedSettings from '../../components/advanced-transaction-settings';

import submitForm from '../../../helpers/forms/forms';
import {NotificationManager} from "react-notifications";
import ModalFooter from '../../components/modal-footer';
import BackForm from '../modal-form/modal-form-container';

class UploadFile extends React.Component {
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
        this.setState({
            isPending: true
        })

        const res = await this.props.submitForm( values, 'uploadTaggedData');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('File has been submitted!', null, 5000);
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
                    render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)} onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    {this.props.modalsHistory.length > 1 &&
	                                <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
	                                }
                                    <p>Upload file</p>
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
                                            placeholder="Tags"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Channel
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            field="channel"
                                            placeholder="Channel"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        File
                                    </label>
                                    <div className="col-md-9">
                                        <div className="iconned-input-field">
                                            <div className="input-group-app search">
                                                <div
                                                    style={{height: 32}}
                                                    className="iconned-input-field"
                                                >
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
                                                    <div className={'input-file-area'}>
                                                        <div className="input-file-name">
                                                            {
                                                                this.state.file &&
                                                                this.state.file.name ? this.state.file.name : '-'
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-sub-title block align-right align-margin-top">
                                            Max file size - 40 KB
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Fee
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent">
                                        <InputForm
                                            field="feeATM"
                                            placeholder="Amount"
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
                                                    width: 80.25
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
                                                    width: 80.25
                                                }}
                                                type="submit"
                                                name={'closeModal'}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                Upload
                                            </button>
                                    }

                                </div>
                                {/*<div className="btn-box align-buttons-inside absolute left-conner">*/}
                                    {/*<a*/}
                                        {/*onClick={this.handleAdvancedState}*/}
                                        {/*className="btn btn-left round round-bottom-left round-top-right"*/}
                                    {/*>*/}
                                        {/*{this.state.advancedState ? "Basic" : "Advanced"}*/}
                                    {/*</a>*/}
                                {/*</div>*/}


                                {
                                    this.state.passphraseStatus &&
                                    <InfoBox danger mt>
                                        Incorrect passphrase.
                                    </InfoBox>
                                }
                                {
                                    this.state.recipientStatus &&
                                    <InfoBox danger mt>
                                        Incorrect recipient.
                                    </InfoBox>
                                }
                                {
                                    this.state.amountStatus &&
                                    <InfoBox danger mt>
                                        Missing amount.
                                    </InfoBox>
                                }
                                {
                                    this.state.feeStatus &&
                                    <InfoBox danger mt>
                                        Missing fee.
                                    </InfoBox>
                                }

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
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);
