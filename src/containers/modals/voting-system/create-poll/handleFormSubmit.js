import {NotificationManager} from "react-notifications";
import {
    setBodyModalParamsAction, 
    setModalData, 
    saveSendModalState, 
    IS_MODAL_PROCESSING
} from '../../../../modules/modals';
import submitForm from '../../../../helpers/forms/forms';

export const handleFormSubmit = (values) => {
    return async dispatch => {
        
        let resultAnswers = {};
    
        if (values.answers) {
            values.answers.forEach((el, index) => {
                if (index > 9) {
                    resultAnswers['option' + index] = el;
                } else {
                    resultAnswers['option0' + index] = el;
                }
            });
        } else {
            NotificationManager.error('Please write answers.', 'Error', 5000);
            return;
        }
    
        dispatch({
            type: IS_MODAL_PROCESSING,
            payload: true
        })

        const res = await dispatch(submitForm.submitForm( {
            ...values,
            votingModel : values.votingModel || 0,
            'create_poll_answers[]': values.answers[0],
            minBalanceModel: 0,
            minBalanceType: 0,
            ...resultAnswers
        }, 'createPoll'));
        
        if (res.errorCode) {
            dispatch({
                type: IS_MODAL_PROCESSING,
                payload: false
            })

            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            dispatch({
                type: IS_MODAL_PROCESSING,
                payload: false
            })

            dispatch(setBodyModalParamsAction(null, {}));
            NotificationManager.success('Your vote has been created!', null, 5000);
        }
    }
};