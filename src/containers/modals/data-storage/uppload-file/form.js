import React from 'react';
import TextualInputComponent from '../../../components/form-components/textual-input/textual-input1';
import MultiSelect from '../../../components/multi-select/index1';
import CustomTextArea from '../../../components/form-components/text-area1';
import FileInput from '../../../components/form-components/file-input1';


const UpploadFileForm = ({  dataTags = [], onChange }) => {
    return (
    <>
        <TextualInputComponent 
            label='Name'
            name="name"
            placeholder="Name"
            type="text"
        />

        <CustomTextArea
            label='Description'
            name='description'
            placeholder='Description'
        />

        <MultiSelect
            label='Tags'
            options={dataTags}
            isClearable={false}
            name="tags"
            onChange={onChange}
            isClearable
            placeholder='Tags'
        />

        <TextualInputComponent 
            label='Channel'
            name="channel"
            placeholder="Channel"
            type="text"
        />

        <FileInput
            label='File'
            maxSize={40000}
            accept="*"
            name="file"
        />
    </>
)};

export default UpploadFileForm;