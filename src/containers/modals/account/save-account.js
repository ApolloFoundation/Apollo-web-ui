/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {Text, TextArea} from 'react-form';
import classNames from "classnames";
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../modules/modals';
import InputForm from '../../components/input-form';
import AccountRS from '../../components/account-rs';
import { readFromLocalStorage, writeToLocalStorage } from '../../../actions/localStorage';
import submitForm from "../../../helpers/forms/forms";
import BackForm from '../modal-form/modal-form-container';

class AddAccount extends React.Component {
    state = {
        activeTab: 0,
        advancedState: false,

        // submitting
        passphraseStatus: false,
        recipientStatus: false,
        amountStatus: false,
        feeStatus: false,
        isPending: false,
    }

    handleFormSubmit = async(values) => {
        if (!this.state.isPending) {
            this.setState({isPending: true});

            if (!values.name) {
                NotificationManager.error('Enter the contact name.', 'Error', 5000);
                this.setState({isPending: false});
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
                this.setState({isPending: false});
                return;
            }

            let localContacts = readFromLocalStorage('APLContacts');

            if (localContacts) {
                localContacts = JSON.parse(localContacts);

                if (!localContacts.filter(contact => contact.accountRS === values.accountRS).length) {
                    localContacts.push(values);
                    writeToLocalStorage('APLContacts', localContacts);
                    NotificationManager.success('Added to contacts!', null, 5000);
                    this.props.closeModal()

                } else {
                    NotificationManager.error('Already in contacts.', 'Error', 5000)

                }
            } else {
                writeToLocalStorage('APLContacts', [values]);
                NotificationManager.success('Added to contacts!', null, 5000);
                this.props.closeModal()
            }

            this.setState({isPending: false});
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
                    render={({ submitForm, values, setValue, getValue }) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)} onSubmit={submitForm}>
                            <div className="form-group-app">
                                <button type="button" onClick={this.props.closeModal} className="exit"><i className="zmdi zmdi-close" /></button>

                                <div className="form-title">
                                    {this.props.modalsHistory.length > 1 &&
	                                <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
	                                }
                                    <p>Add Contact</p>
                                </div>
                                <div className="form-group mb-15">
                                    <label>
                                        Name
                                    </label>
                                    <div>
                                        <InputForm
                                            field="name"
                                            placeholder="Contact Name"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group mb-15">
                                    <label>
                                        Account ID
                                    </label>
                                    <div>
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
                                <div className="form-group mb-15">
                                    <label>
                                        Email Address
                                    </label>
                                    <div>
                                        <Text className="form-control" placeholder={'contact@email.com'} type="text" field={'email'}/>
                                    </div>
                                </div>
                                <div className="form-group mb-15">
                                    <label>
                                        Description
                                    </label>
                                    <div>
                                        <TextArea className="form-control" placeholder="Optional" field="message" cols="30" rows="5" />
                                    </div>
                                </div>
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
                                        <span className={'button-text'}>Add Account</span>
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
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddAccount);
