/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useState } from 'react';
import TabulationBody from "containers/components/tabulator/tabuator-body";
import TabContaier from "containers/components/tabulator/tab-container";
import ModalBody from "containers/components/modals/modal-body";
import { SignTransactionForm } from './Forms/SignTransaction';
import { BroadcastTransactionForm } from './Forms/BroadcatTransactionForm';
import { FullHashForm } from './Forms/FullHashForm';
import { ParseTransactionForm } from './Forms/ParseTransactionForm'

const TransactionOperations = ({ closeModal, processForm }) => {
    const [state, setState] = useState({
        activeTab: 0,
        showSignature: false,
        signedBytesSignature: "",
        generatedQr: "",
    });

    const handleTab = (e, index) => {
        setState(prevState => ({
            ...prevState,
            activeTab: index
        }));
    };

    return (
        <ModalBody
            modalTitle='Transaction Operations'
            closeModal={closeModal}
            isDisableFormFooter
            isDisableSecretPhrase
            isXWide
        >
            <TabulationBody
                className='p-0'
                onChange={handleTab}
            >
                <TabContaier sectionName='Sign transaction'>
                    <SignTransactionForm
                        state={state}
                        setState={setState}
                        closeModal={closeModal}
                    />
                </TabContaier>
                <TabContaier sectionName='Broadcast transaction'>
                    <BroadcastTransactionForm closeModal={closeModal} processForm={processForm} />
                </TabContaier>
                <TabContaier sectionName='Parse transaction'>
                    <ParseTransactionForm closeModal={closeModal} processForm={processForm} />
                </TabContaier>
                <TabContaier sectionName='Calculate full hash'>
                    <FullHashForm closeModal={closeModal} processForm={processForm} />
                </TabContaier>
            </TabulationBody>
        </ModalBody>
    );
}

export default TransactionOperations;