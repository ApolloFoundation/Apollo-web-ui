import React from 'react';
import TextualInputComponent from '../../../components/form-components/textual-input';
import MultiSelect from '../../../components/multi-select';
import CustomTextArea from '../../../components/form-components/text-area';
import FileInput from '../../../components/form-components/file-input';


const UpploadFileForm = ({ setValue, dataTags = [], value, onChange }) => {
    return (
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

        <MultiSelect
            label={'Tags'}
            options={dataTags}
            isClearable={false}
            value={value}
            onChange={onChange}
            isClearable={false}
            placeholder={'Tags'}
        />

        <TextualInputComponent 
            label={'Channel'}
            field="channel"
            placeholder="Channel"
            type={"text"}
            setValue={setValue}
        />

        <FileInput
            label={'File'}
            maxSize={40000}
            setValue={setValue}
        />
    </>
)};

export default UpploadFileForm;