/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationManager } from "react-notifications";
import ModalBody from '../../../components/modals/modal-body';
import { getTickerSelector } from '../../../../selectors';
import { IS_MODAL_PROCESSING } from '../../../../modules/modals';
import PollForm from './form';

const CreatePoll = ({ processForm, nameModal, closeModal }) => {
    const dispatch = useDispatch();
    const ticker = useSelector(getTickerSelector);

    const handleFormSubmit = useCallback(async(values) => {
        if (!values.answers) {
            NotificationManager.error('Please write answers.', 'Error', 5000);
            return;
        }

        const resultAnswers = values.answers.reduce((acc, item, index) => {
            if(index > 9) {
                acc['option' + index] = item;
            } else {
                acc['option0' + index] = item;
            }
            return acc
        }, {});

        const reqParams = {
            ...values,
            votingModel : values.votingModel || 0,
            'create_poll_answers[]': values.answers[0],
            minBalanceModel: values.votingModel || 0,
            ...resultAnswers
        };

        processForm(reqParams, 'createPoll', 'Your vote has been created!', (res) => {
            dispatch({
                type: IS_MODAL_PROCESSING,
                payload: false
            });

            closeModal();
            NotificationManager.success('Your vote has been created!', null, 5000);
        });
    }, [dispatch, closeModal,])

    return (
        <ModalBody
            modalTitle='Create Poll'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Create'
            nameModel={nameModal}
            idGroup='create-poll-modal-'
            initialValues={{
                answers: [''],
                minNumberOfOptions: 1,
                maxNumberOfOptions: 1,
                minRangeValue: 0,
                maxRangeValue: 1,
                minBalance: 0,
            }}
        >
            <PollForm ticker={ticker} />
        </ModalBody>
    );
}

export default CreatePoll;
