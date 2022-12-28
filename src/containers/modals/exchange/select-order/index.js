import React from 'react';
import { useSelector } from 'react-redux';
import ModalBody from '../../../components/modals/modal-body';
import TextualInputComponent from '../../../components/form-components/textual-input/textual-input1';
import { getModalDataSelector } from '../../../../selectors';

const SelectOrder = ({ closeModal }) => {
    const modalData = useSelector(getModalDataSelector);
    return (
        <ModalBody
            modalTitle='Chosen trade'
            closeModal={closeModal}
            isDisableSecretPhrase
            isDisableFormFooter
            initialValues={{
                ...modalData,
            }}
        >
            <TextualInputComponent
                name='typeName'
                disabled
                label='Type'
                placeholder='Type'
            />
            <TextualInputComponent
                name='pairRate'
                disabled
                label='Price'
                placeholder='Price'
            />
            <TextualInputComponent
                name='offerAmount'
                disabled
                label='Amount'
                placeholder='Amount'
            />
            <TextualInputComponent
                name='total'
                disabled
                label='Total'
                placeholder='Total'
            />
            <TextualInputComponent
                name='statusName'
                disabled
                label='Status'
                placeholder='Status'
            />
        </ModalBody>
    );
}

export default SelectOrder;
