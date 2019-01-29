import React from 'react';

import TextualInputComponent from '../../../components/form-components/textual-input';
import CustomTextArea from '../../../components/form-components/text-area';

import {CheckboxFormInput} from '../../../components/form-components/check-button-input';
import FileInput from '../../../components/form-components/file-input';
import ModalBody from '../../../components/modals/modal-body';


const UpploadFileForm = ({setValue}) => (
    <>
        <TextualInputComponent 
            label={'Name'}
            field="name"
            placeholder="Name"
            type={"text"}
            setValue={setValue}
        />

        <CustomTextArea
            label={'Description'} 
            field={'description'} 
            placeholder={'Description'}
            setValue={setValue}
        />

        <TextualInputComponent 
            label={'Tags'}
            field="tags"
            placeholder="Tags"
            type={"text"}
            setValue={setValue}
        />

        <TextualInputComponent 
            label={'Channel'}
            field="channel"
            placeholder="Channel"
            type={"text"}
            setValue={setValue}
        />

        <FileInput
            setValue={setValue}
        />

    </>
)

export default UpploadFileForm;