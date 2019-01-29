import React from 'react';
import TextualInputComponent from '../../../components/form-components/textual-input';
import CustomTextArea from '../../../components/form-components/text-area';
import NumericInputComponent from '../../../components/form-components/numeric-input';
import ImageInput from '../../../components/form-components/image-input';

import {CheckboxFormInput} from '../../../components/form-components/check-button-input';
import FileInput from '../../../components/form-components/file-input';
import ModalBody from '../../../components/modals/modal-body';



const ListProductForSaleFrom = ({setValue}) => (
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
            placeholder={"Tags (categories)"}
            type={"text"}
            setValue={setValue}
        />

        <NumericInputComponent
            countLabel={'APL'}
            label={'Price'}
            field={'priceATM'}
            placeholder={'Price'}
            setValue={setValue}
        />

        <NumericInputComponent
            countLabel={''}
            label={'Quantity'}
            field={'quantity'}
            placeholder={'Quantity'}
            setValue={setValue}
        />
        
        <ImageInput 
            setValue={setValue}
        />
    </>
)

export default ListProductForSaleFrom;