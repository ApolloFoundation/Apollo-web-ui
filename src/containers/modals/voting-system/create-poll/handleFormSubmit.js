import {NotificationManager} from "react-notifications";
import {
    setBodyModalParamsAction, 
    IS_MODAL_PROCESSING
} from '../../../../modules/modals';

export function handleFormSubmit (values) {
    const {dispatch} = this.store;
    
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

    const reqParams = {
        ...values,
        votingModel : values.votingModel || 0,
        'create_poll_answers[]': values.answers[0],
        minBalanceModel: values.votingModel || 0,
        ...resultAnswers
    };

    this.processForm(reqParams, 'createPoll', 'Your vote has been created!', (res) => {
        dispatch({
            type: IS_MODAL_PROCESSING,
            payload: false
        });

        dispatch(setBodyModalParamsAction(null, {}));
        NotificationManager.success('Your vote has been created!', null, 5000);
    });

};