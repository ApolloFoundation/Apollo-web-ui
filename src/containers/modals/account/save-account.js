/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../modules/modals';
import InputForm from '../../components/input-form';
import AccountRS from '../../components/account-rs';
import {Form, Text, TextArea} from 'react-form';

import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";

import BackForm from '../modal-form/modal-form-container';

class AddAccount extends React.Component {
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
        if (!values.name) {
            NotificationManager.error('Enter the contact name.', 'Error', 5000);
            return;
        }
        
        if (values.recipient) {
            values.accountRS = values.recipient;
            delete values.recipient;
        } 

        if (!values.recipient && !values.accountRS) {
            values.accountRS = this.props.modalData;
        }

        if (!values.accountRS) {
            NotificationManager.error('Enter the contact id.', 'Error', 5000);
            return;
        }

        let localContacts = localStorage.getItem('APLContacts');

        if (localContacts) {
            localContacts = JSON.parse(localContacts);

            if (localContacts.indexOf(values) === -1) {
                localContacts.push(values);
                localStorage.setItem('APLContacts', JSON.stringify(localContacts));
                NotificationManager.success('Added to contacts!', null, 5000);
                this.props.closeModal()

            } else {
                NotificationManager.error('Already in contacts.', 'Error', 5000)

            }
        } else {
            localStorage.setItem('APLContacts', JSON.stringify([values]));
            NotificationManager.success('Added to contacts!', null, 5000);
            this.props.closeModal()
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
                    render={({ submitForm, values, addValue, removeValue, setValue, getValue }) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)} onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    {this.props.modalsHistory.length > 1 &&
	                                <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
	                                }
                                    <p>Add Contact</p>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    {console.log('1 ', getValue('recipient') || '')}
                                    {console.log('2 ', this.props.modalData)}
                                    <label className="col-sm-3 col-form-label">
                                        Name
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            field="name"
                                            placeholder="Contact Name"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Account ID
                                    </label>
                                    <div className="col-sm-9">
                                        <AccountRS
                                            field={'accountRS'}
                                            noContactList={true}
                                            placeholder="Account ID"
                                            defaultValue={getValue('recipient') || this.props.modalData}
                                            setValue={setValue}
                                            value={getValue('recipient') || this.props.modalData}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Email Address
                                    </label>
                                    <div className="col-md-9">
                                        <Text className="form-control" placeholder={'contact@email.com'} type="text" field={'email'}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label align-self-start">
                                        Description
                                    </label>
                                    <div className="col-sm-9">
                                        <TextArea className="form-control" placeholder="Optional" field="message" cols="30" rows="5" />
                                    </div>
                                </div>

                                <div className="btn-box align-buttons-inside absolute right-conner">
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Add Account
                                    </button>
                                    <a onClick={() => this.props.closeModal()} className="btn btn-right round round-top-left">Cancel</a>
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
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddAccount);
