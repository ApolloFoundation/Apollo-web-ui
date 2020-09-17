import React from 'react';
import TextualInputComponent from '../../../components/form-components/textual-input';
import CustomTextArea from '../../../components/form-components/text-area';
import NumericInputComponent from '../../../components/form-components/numeric-input';
import FileInput from '../../../components/form-components/file-input';


const ListProductForSaleFrom = ({setValue, ticker}) => (
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
            countLabel={ticker}
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

        <FileInput
            label={'Image'}
            type={'image/jpeg, image/jpg, image/png'}
            showPreview
            maxSize={40000}
            setValue={setValue}
        />
    </>
);

export default ListProductForSaleFrom;
