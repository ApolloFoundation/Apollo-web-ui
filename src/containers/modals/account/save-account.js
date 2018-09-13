import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import {Form, Text, TextArea} from 'react-form';

import AccountRS from '../../components/account-rs';
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";

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
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({ submitForm, values, addValue, removeValue, setValue }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Add Contact</p>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Name</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder={'Contact Name'} field={'name'}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Account ID</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text defaultValue={this.props.modalData} placeholder={'Secret Phrase'} type="text" field={'accountRS'}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Email Address</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder={'contact@email.com'} type="text" field={'email'}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Description</label>
                                        </div>
                                        <div className="col-md-9">
                                            <TextArea placeholder="Optional" field="message" cols="30" rows="10" />
                                        </div>
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
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddAccount);
