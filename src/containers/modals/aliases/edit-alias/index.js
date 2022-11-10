/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {getAliasAction} from '../../../../actions/aliases/';
import ModalBody from '../../../components/modals/modal-body';
import { getModalDataSelector } from '../../../../selectors';
import EditAliasForm from './form';

const EditAlias = ({ closeModal, processForm }) => {
    const dispatch = useDispatch();
    const modalData = useSelector(getModalDataSelector);
    const [alias, setAlias] = useState(null);

    const handleFormSubmit = useCallback(async (values) => {
        const data = {
            ...values,
            aliasName: alias.aliasName,
        };

        processForm(data, 'setAlias', 'Alias has been edited!', () => {
            closeModal();
            NotificationManager.success('Alias has been edited!', null, 5000);
        });
    }, [closeModal, alias?.aliasName])

    const getAlias = async () => {
        const aliasResponse = await dispatch(getAliasAction({alias: modalData}));

        if (aliasResponse) {
            setAlias(aliasResponse);
        }
    };

    useEffect(() => {
        getAlias();
    }, [])

    return (
        <ModalBody
            modalTitle='Edit Alias'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Edit Alias'
        >
            <EditAliasForm alias={alias} />
        </ModalBody>
    );
}

export default EditAlias;
