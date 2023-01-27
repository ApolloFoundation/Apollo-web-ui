/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import ModalBody from 'containers/components/modals/modal-body';
import TabulationBody from 'containers/components/tabulator/tabuator-body';
import TabContaier from 'containers/components/tabulator/tab-container';
import { GenerateToken } from './GenerateToken';
import { ValidateToken } from './ValidateToken';


const TokenGenerationValidation = ({ closeModal }) => (
    <ModalBody
        modalTitle='Token generation / validation'
        closeModal={closeModal}
        isDisableFormFooter
        isDisableSecretPhrase
    >
        <TabulationBody className='p-0'>
            <TabContaier sectionName='Generate token'>
                <GenerateToken closeModal={closeModal} />
            </TabContaier>
            <TabContaier sectionName='Validate token'>
                <ValidateToken closeModal={closeModal} />
            </TabContaier>
        </TabulationBody>
    </ModalBody>
);

export default TokenGenerationValidation;
