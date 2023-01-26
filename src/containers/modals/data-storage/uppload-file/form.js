import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import MultiSelect from 'containers/components/multi-select';
import CustomTextArea from 'containers/components/form-components/TextArea/TextAreaWithFormik';
import FileInput from 'containers/components/form-components/FIleInput';
import { getConstantsSelector } from 'selectors';


const UpploadFileForm = ({  dataTags = [], onChange }) => {
    const constants = useSelector(getConstantsSelector, shallowEqual);
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
            maxSize={constants?.MAX_TAGGED_DATA_DATA_LENGTH ?? 40000}
            accept="*"
            name="file"
        />
    </>
)};

export default UpploadFileForm;