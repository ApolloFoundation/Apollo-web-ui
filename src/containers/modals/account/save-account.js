/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {NotificationManager} from "react-notifications";
import classNames from "classnames";
import AccountRS from '../../components/account-rs';
import { readFromLocalStorage, writeToLocalStorage } from '../../../actions/localStorage';
import BackForm from '../modal-form/modal-form-container';
import { ModalBackButton } from '../../components/ModalBackButton';
import CustomInput from '../../components/custom-input';
import CustomTextArea from '../../components/form-components/TextArea/TextAreaWithFormik';
import { getModalDataSelector } from '../../../selectors';

const AddAccount = (props) => {
    const [isPending, setIsPending] = useState(false);
    const modalData = useSelector(getModalDataSelector);

    const handleFormSubmit = async(data) => {
        if (!isPending) {
            const values = { ...data };
            setIsPending(true);

            if (!values.name) {
                NotificationManager.error('Enter the contact name.', 'Error', 5000);
                setIsPending(false);
                return;
            }

            if (!values.accountRS) {
                NotificationManager.error('Enter the contact id.', 'Error', 5000);
                setIsPending(false);
                return;
            }

            let localContacts = readFromLocalStorage('APLContacts');

            if (localContacts) {
                localContacts = JSON.parse(localContacts);

                if (!localContacts.filter(contact => contact.accountRS === values.accountRS).length) {
                    localContacts.push(values);
                    writeToLocalStorage('APLContacts', localContacts);
                    NotificationManager.success('Added to contacts!', null, 5000);
                    props.closeModal()

                } else {
                    NotificationManager.error('Already in contacts.', 'Error', 5000)

                }
            } else {
                writeToLocalStorage('APLContacts', [values]);
                NotificationManager.success('Added to contacts!', null, 5000);
                this.props.closeModal()
            }

            setIsPending(false);
        }
    };

    return (
        <div className="modal-box">
            <BackForm
                nameModal={props.nameModal}
                onSubmit={handleFormSubmit}
                initialValues={{
                    accountRS: modalData.recipient,
                }}
            >
                <div className="form-group-app">
                    <button type="button" onClick={props.closeModal} className="exit">
                        <i className="zmdi zmdi-close" />
                    </button>

                    <div className="form-title">
                        <ModalBackButton />
                        <p>Add Contact</p>
                    </div>
                    <div className="form-group mb-15">
                        <CustomInput
                            label="Name"
                            name="name"
                            placeholder="Contact Name"
                        />
                    </div>
                    <div className="form-group mb-15">
                        <label>
                            Account ID
                        </label>
                        <div>
                            <AccountRS
                                name='accountRS'
                                noContactList
                                placeholder="Account ID"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="form-group mb-15">
                        <CustomInput
                            label="Email Address"
                            placeholder="contact@email.com"
                            type="text"
                            name="email"
                        />
                    </div>
                    <div className="form-group mb-15">
                        <CustomTextArea
                            label="Description"
                            placeholder="Optional"
                            name="message"
                            cols="30"
                            rows="5"
                        />
                    </div>
                    <div className="btn-box right-conner align-right form-footer">
                        <button
                            type='button'
                            onClick={props.closeModal}
                            className="btn btn-default mr-3"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            name='closeModal'
                            className={classNames({
                                "btn btn-green submit-button": true,
                                "loading btn-green-disabled": isPending,
                            })}
                        >
                            <div className="button-loader">
                                <div className="ball-pulse">
                                    <div/>
                                    <div/>
                                    <div/>
                                </div>
                            </div>
                            <span className='button-text'>Add Account</span>
                        </button>
                    </div>
                </div>
            </BackForm>
        </div>
    );
}

export default AddAccount;
