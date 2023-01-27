/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import { useSelector} from 'react-redux';
import {NotificationManager} from "react-notifications";
import TabulationBody from 'containers/components/tabulator/tabuator-body';
import TabContaier from 'containers/components/tabulator/tab-container';
import ModalBody from 'containers/components/modals/modal-body';
import { getTickerSelector } from 'selectors';
import { useAliasDataLoader } from '../useAliasDataLoader';
import { ToSpecificAccount } from './Tabs/ToSpecificAccount';
import { ToAnyoneAccount } from './Tabs/ToAnyoneAccount';

const SellAlias = (props) => {
    const alias = useAliasDataLoader();
    const ticker = useSelector(getTickerSelector);

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
