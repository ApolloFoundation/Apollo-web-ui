import {NotificationManager} from "react-notifications";

import {
    setBodyModalParamsAction, 
    IS_MODAL_PROCESSING
} from '../../../../modules/modals';

import submitForm from '../../../../helpers/forms/forms';

export const handleFormSubmit = (values) => {
    const {dispatch} = this.store;

    values = {
        ...values,
        registrationPeriod: 1439
    };

    this.processForm(values, 'shufflingCreate', 'Shuffling Created!', (res) => {
        NotificationManager.success('Shuffling Created!', null, 5000);

        const reqParams = {
            transactionBytes: res.transactionBytes || res.unsignedTransactionBytes,
            prunableAttachmentJSON: JSON.stringify({...(res.transactionJSON.attachment), "version.ShufflingCreation": 1}),
            createNoneTransactionMethod: true
        }

        this.processForm(reqParams, 'broadcastTransaction', 'Shuffling Created!', (broadcast) => {
            dispatch(setBodyModalParamsAction('START_SHUFFLING', {broadcast}));
        })
    })
};