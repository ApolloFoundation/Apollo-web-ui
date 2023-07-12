/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import {NotificationManager} from "react-notifications";
import AccountRS from 'containers/components/form-components/AccountRS';
import { readFromLocalStorage, writeToLocalStorage } from 'actions/localStorage';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import CustomTextArea from 'containers/components/form-components/TextArea/TextAreaWithFormik';
import ModalBody from 'containers/components/modals/modal-body';
import { getModalDataSelector } from 'selectors';

const AddAccount = (props) => {
    const [isPending, setIsPending] = useState(false);
    const modalData = useSelector(getModalDataSelector, shallowEqual);

    const handleFormSubmit = useCallback(async(data) => {
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
                props.closeModal()
            }

            setIsPending(false);
        }
    }, [props.closeModal, isPending]);

    return (
        <ModalBody
            nameModal={props.nameModal}
            handleFormSubmit={handleFormSubmit}
            initialValues={{
                accountRS: modalData.recipient ?? modalData ,
            }}
            modalTitle="Add Contact"
            closeModal={props.closeModal}
            submitButtonName="Add Account"
            isPending={isPending}
        >
            <CustomInput
                label="Name"
                name="name"
                placeholder="Contact Name"
            />
            <AccountRS
                name='accountRS'
                noContactList
                placeholder="Account ID"
                disabled
                label="Account ID"
            />
            <CustomInput
                label="Email Address"
                placeholder="contact@email.com"
                type="text"
                name="email"
            />
            <CustomTextArea
                label="Description"
                placeholder="Optional"
                name="message"
                cols="30"
                rows="5"
            />
        </ModalBody>
    );
}

export default AddAccount;
