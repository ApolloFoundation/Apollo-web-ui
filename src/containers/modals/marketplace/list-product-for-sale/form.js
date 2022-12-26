import React from 'react';
import TextualInputComponent from '../../../components/form-components/textual-input/textual-input1';
import CustomTextArea from '../../../components/form-components/text-area1';
import NumericInputComponent from '../../../components/form-components/NumericInput/numeric-input1';
import FileInput from '../../../components/form-components/file-input1';

const ListProductForSaleFrom = ({ ticker }) => (
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
        <TextualInputComponent
            label='Tags'
            name="tags"
            placeholder="Tags (categories)"
            type="text"
        />
        <NumericInputComponent
            countLabel={ticker}
            label='Price'
            name='priceATM'
            placeholder='Price'
        />
        <NumericInputComponent
            countLabel=''
            label='Quantity'
            name='quantity'
            placeholder='Quantity'
        />
        <FileInput
            label='Image'
            type='image/jpeg, image/jpg, image/png'
            showPreview
            maxSize={40000}
        />
    </>
);

export default ListProductForSaleFrom;
