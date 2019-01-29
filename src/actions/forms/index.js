/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios'
import config from '../../config'
import queryString from 'query-string';
import submitForm from '../../helpers/forms/forms';
import store from '../../store';

const {dispatch} = store;


export const calculateFeeAction = (requestParams, requestType) => {
    return dispatch(submitForm.submitForm(requestParams, requestType))
}
