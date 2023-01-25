/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import { useSelector} from 'react-redux';
import {NotificationManager} from "react-notifications";
import TabulationBody from '../../../components/tabulator/tabuator-body';
import TabContaier from '../../../components/tabulator/tab-container';
import ModalBody from '../../../components/modals/modal-body';
import { getTickerSelector } from '../../../../selectors';
import { ToSpecificAccount } from './Tabs/ToSpecificAccount';
import { ToAnyoneAccount } from './Tabs/ToAnyoneAccount';
import { useAliasDataLoader } from '../useAliasDataLoader';
import { PureModal } from 'containers/components/modals/pure-modal/pure-modal';

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
            // onSubmit={handleFormSubmit}
            closeModal={props.closeModal}
            isDisableSecretPhrase
            isAdvanced
            isAdvancedWhite
            isDisableFormFooter
            // initialValues={{
            //     add_message: false,
            //     recipient: alias ? alias.accountRS : '',
            //     priceATM: '',
            //     message: '',
            //     encrypt_message: false,
            //     permanent_message: false,
            // }}
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
