/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {getAliasAction} from "../../../../actions/aliases";
import TabulationBody from '../../../components/tabulator/tabuator-body';
import TabContaier from '../../../components/tabulator/tab-container';
import ModalBody from '../../../components/modals/modal-body';
import { getModalDataSelector, getTickerSelector } from '../../../../selectors';
import { ToSpecificAccount } from './forms/ToSpecificAccount';
import { ToAnyoneAccount } from './forms/ToAnyoneAccount';

const SellAlias = (props) => {
    const dispatch = useDispatch();
    const [alias, setAlias] = useState(null);
    const modalData = useSelector(getModalDataSelector);
    const ticker = useSelector(getTickerSelector);

    const getAlias = useCallback(async () => {
        const alias = await dispatch(getAliasAction({ alias: modalData }));

        if (alias) {
            setAlias(alias);
        }
    }, [modalData, dispatch]);

    useEffect(() => {
        getAlias();
    }, [getAlias]);

    const handleFormSubmit = useCallback(async (values) => {
        const data = {
            ...values,
            aliasName: alias.aliasName,
        }
        
        props.processForm(data, 'sellAlias', 'Alias has been listed!', () => {
            props.closeModal();
            NotificationManager.success('Alias has been listed!', null, 5000);
        });
    }, [alias, props.processForm, props.closeModal]);

    return (
        <ModalBody
            modalTitle='Sell Alias'
            submitButtonName='Sell Alias'
            closeModal={props.closeModal}
            isDisableSecretPhrase
            isAdvanced
            isAdvancedWhite
            isDisableFormFooter
        >
            <TabulationBody className='p-0'>
                <TabContaier sectionName='Sell alias to Specific Account'>
                    <ToSpecificAccount
                        ticker={ticker}
                        alias={alias}
                        closeModal={props.closeModal}
                        onSubmit={handleFormSubmit}
                    />
                </TabContaier>

                <TabContaier sectionName='Sell to Anyone'>
                    <ToAnyoneAccount
                        ticker={ticker}
                        alias={alias}
                        closeModal={props.closeModal}
                        onSubmit={handleFormSubmit}
                    />
                </TabContaier>
            </TabulationBody>
        </ModalBody>
    );
}

export default SellAlias;
