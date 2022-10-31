/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useState } from 'react';
import TabulationBody from "../../../components/tabulator/tabuator-body";
import TabContaier from "../../../components/tabulator/tab-container";
import ModalBody from "../../../components/modals/modal-body";
import { SignTransactionForm } from './Forms/SignTransaction';
import { BroadcastTransactionForm } from './Forms/BroadcatTransactionForm';
import { FullHashForm } from './Forms/FullHashForm';
import { ParseTransactionForm } from './Forms/ParseTransactionForm'

const TransactionOperations = ({ closeModal }) => {
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
                    <BroadcastTransactionForm closeModal={closeModal} />
                </TabContaier>
                <TabContaier sectionName='Parse transaction'>
                    <ParseTransactionForm closeModal={closeModal} />
                </TabContaier>
                <TabContaier sectionName='Calculate full hash'>
                    <FullHashForm closeModal={closeModal} />
                </TabContaier>
            </TabulationBody>
        </ModalBody>
    );
}

export default TransactionOperations;