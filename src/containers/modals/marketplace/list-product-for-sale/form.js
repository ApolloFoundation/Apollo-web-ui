import React from 'react';
import TextualInputComponent from '../../../components/form-components/TextualInput';
import CustomTextArea from '../../../components/form-components/TextArea/TextAreaWithFormik';
import NumericInputComponent from '../../../components/form-components/NumericInput';
import FileInput from '../../../components/form-components/FIleInput';

const ListProductForSaleFrom = ({ ticker, maxSize }) => (
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
            name="messageFile"
            label='Image'
            type='image/jpeg, image/jpg, image/png'
            showPreview
            maxSize={maxSize ?? 40000}
        />
    </>
);

export default ListProductForSaleFrom;
