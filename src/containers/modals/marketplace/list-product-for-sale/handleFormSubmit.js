import {NotificationManager} from 'react-notifications';
import {
    setBodyModalParamsAction, 
    IS_MODAL_PROCESSING
} from '../../../../modules/modals';

export const handleFormSubmit = (values) => {
    const {dispatch} = this.store;

    this.processForm(values, 'dgsListing', 'Product has been listed!',() => {
        dispatch({
            type: IS_MODAL_PROCESSING,
            payload: false
        })

        dispatch(setBodyModalParamsAction(null, {}));
        NotificationManager.success('Product has been listed!', null, 5000);
    })
};