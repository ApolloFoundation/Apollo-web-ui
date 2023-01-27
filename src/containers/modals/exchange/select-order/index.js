import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import ModalBody from 'containers/components/modals/modal-body';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import { getModalDataSelector } from 'selectors';

const SelectOrder = ({ closeModal }) => {
    const modalData = useSelector(getModalDataSelector, shallowEqual);
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
