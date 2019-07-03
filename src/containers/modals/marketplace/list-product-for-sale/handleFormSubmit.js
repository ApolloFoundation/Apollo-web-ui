import {NotificationManager} from 'react-notifications';
import {
    setBodyModalParamsAction, 
    IS_MODAL_PROCESSING
} from '../../../../modules/modals';

export const handleFormSubmit = function(values) {
    const {dispatch} = this.store;

    if (!values.secretPhrase || values.secretPhrase.length === 0) {
        NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
        return;
    }

    if (!values.quantity || parseFloat(values.quantity) === 0) {
        NotificationManager.error('Quantity is required.', 'Error', 5000);
        return;
    }

    this.processForm(values, 'dgsListing', 'Product has been listed!',() => {
        dispatch({
            type: IS_MODAL_PROCESSING,
            payload: false
        });

        dispatch(setBodyModalParamsAction(null, {}));
        NotificationManager.success('Product has been listed!', null, 5000);
    })
};