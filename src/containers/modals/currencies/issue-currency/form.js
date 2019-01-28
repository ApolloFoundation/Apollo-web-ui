import React from 'react';
import NumericInput from '../../../components/form-components/numeric-input';

import TextualInputComponent from '../../../components/form-components/textual-input';

import {CheckboxFormInput} from '../../../components/form-components/check-button-input';
import CustomTextArea from '../../../components/form-components/text-area';
import ModalBody from '../../../components/modals/modal-body';

const IssueCurrencyForm = (props) => {
    const {setValue, getFormState} = props;
    
    const {values : {type1, type2, type3, type4, type5, type6}} = getFormState()

    return (
        <>
            <TextualInputComponent 
                label={'Currency Name'}
                disabled={true}
                field="name"
                placeholder="Currency Name"
                type={"text"}
                setValue={setValue}
            />
            
            <TextualInputComponent 
                label={'Currency Code'}
    
                disabled={true}
                field="code"
                placeholder="Currency Code"
                type={"text"}
                setValue={setValue}
    
            />
    
            <CustomTextArea
                label={'Description'} 
                field={'description'} 
                placeholder={'Description'}
                setValue={setValue}
    
            />
            
            
            <CheckboxFormInput
                setValue={setValue}
    
                label={'Type'}
                checkboxes={[
                    {
                        label: 'Exchangeable',
                        field: 'type1',
                        // handler : this.setFormState(form)
                    },
                    {
                        label: 'Controllable',
                        field: 'type2',
                        // handler : this.setFormState(form)
                    },
                    {
                        label: 'Reservable',
                        field: 'type3',
                        // handler : this.setFormState(form)
                    },
                    {
                        label: 'Claimable',
                        field: 'type4',
                        // handler : this.setFormState(form)
                    },
                    {
                        label: 'Mintable',
                        field: 'type5',
                        // handler : this.setFormState(form)
                    },
                    {
                        label: 'Non-Shuffleable',
                        field: 'type6',
                        // handler : this.setFormState(form)
                    },
                ]}
            />
        
            {
                type3 &&
                <>
                    <NumericInput
                        setValue={setValue}
            
                        label={'Minimum Amount to Reserve Per Unit'}
                        field={'minReservePerUnitATM'}
                        countingTtile={'APL'}
                        placeholder={'Minimum Amount Per Unit'}
                        type={'tel'}
                    />
            
                    <NumericInput
                        setValue={setValue}
            
                        label={'Reserve Supply'}
                        field={'reserveSupply'}
                        countingTtile={'APL'}
                        placeholder={'Number of Units'}
                        type={'tel'}
                    />
                </>
            }
            
            {
                type5 &&
                <>
                    <NumericInput
                        setValue={setValue}
            
                        label={'Minimum Difficulty'}
                        field={'minDifficulty'}
                        countingTtile={'APL'}
                        placeholder={'Minimum Difficulty'}
                        type={'tel'}
                    />
                    
            
                    <NumericInput
                        setValue={setValue}
            
                        label={'Maximum Difficulty'}
                        field={'maxDifficulty'}
                        countingTtile={'APL'}
                        placeholder={'Maximum Difficulty'}
                        type={'tel'}
                    />
                </>
            }
    
            <NumericInput
                setValue={setValue}
    
                label={'Initial Supply'}
                field={'initialSupply'}
                countingTtile={'APL'}
                placeholder={'Initial Supply'}
                type={'tel'}
            />
            
            <NumericInput
                setValue={setValue}
    
                label={'Total Supply'}
                field={'maxSupply'}
                countingTtile={'APL'}
                placeholder={'Total Supply'}
                type={'tel'}
            />
    
            <NumericInput
                setValue={setValue}
    
                label={'Decimals'}
                field={'decimals'}
                placeholder={'Decimals'}
                type={'tel'}
            />
    
            <NumericInput
                setValue={setValue}
    
                label={'Activation Height'}
                field={'height'}
                // disabled={type1 && !type2 &&  !type3 &&  !type4 &&  !type5 && !type6}
                placeholder={'Activation height'}
                type={'tel'}
            />
        </>
    )
}

export default IssueCurrencyForm;