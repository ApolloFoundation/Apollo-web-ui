import React from 'react';
import {Creatable} from 'react-select';
import TextualInputComponent from '../../../components/form-components/textual-input';
import CustomTextArea from '../../../components/form-components/text-area';
import FileInput from '../../../components/form-components/file-input';


const UpploadFileForm = ({ setValue, dataTags = [] }) => {
    const handleChange = (newValue, actionMeta) => {
        console.group('Value Changed');
        console.log(newValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
    };
    
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

        <>
            <label className='form-group mb-15'>Tags</label>
            <Creatable
                isMulti
                className={'form-custom-select'}
                classNamePrefix={'custom-select-box'}
                placeholder='Tags'
                isClearable={false}
                onChange={handleChange}
                options={dataTags}
            />
        </>

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