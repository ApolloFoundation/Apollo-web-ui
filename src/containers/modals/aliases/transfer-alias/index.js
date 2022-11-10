/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {NotificationManager} from "react-notifications";
import {getAliasAction} from "../../../../actions/aliases";
import submitForm from "../../../../helpers/forms/forms";
import ModalBody from '../../../components/modals/modal-body';
import { getModalDataSelector } from '../../../../selectors';
import TransferCurrencyForm from './form';

const TransferAlias = ({ closeModal }) => {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        isPending: false,
        alias: null,
    });
    const modalData = useSelector(getModalDataSelector);

    const handleFormSubmit = useCallback(async (values) => {
        setState(prevState => ({
            ...prevState,
            isPending: true,
        }));

        const data = {
            ...values,
            priceATM: 0,
            aliasName: state.alias.aliasName
        };

        const res = await dispatch(submitForm.submitForm(data, 'sellAlias'));
        if (res && res.errorCode) {
            setState(prevState => ({
                ...prevState,
                isPending: false
            }));
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            closeModal();
            NotificationManager.success('Alias has been transferred!', null, 5000);
        }
    }, [dispatch, state.isPending, state.alias, closeModal]);

    const getAlias = async () => {
        const aliasRes = await dispatch(getAliasAction({alias: modalData}));

        if (aliasRes) {
            setState(prevState => ({
                ...prevState,
                alias: aliasRes,
            }));
        }
    };

    useEffect(() => {
        getAlias();
    }, []);


    return (
        <ModalBody
            modalTitle='Transfer Alias'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Transfer Alias'
            isPending={state.isPending}
        >
            <TransferCurrencyForm alias={state.alias} />
        </ModalBody>
    );
}

export default TransferAlias;
