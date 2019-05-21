import React from 'react';

import {Text} from 'react-form';
import {CheckboxFormInput} from '../../../components/form-components/check-button-input';
import TextualInputComponent from '../../../components/form-components/textual-input';
import NumericInputComponent from '../../../components/form-components/numeric-input';
import CustomTextArea from '../../../components/form-components/text-area';
import CustomFormSelect from '../../../components/form-components/custom-form-select';
import CustomInputForm from '../../../components/form-components/textual-input';

import AssetInput from '../../../components/form-components/asset-input';
import CurrencyInput from '../../../components/form-components/currency-input';

import BlockHeightInput from '../../../components/form-components/block-height-input';

import InputForm from '../../../components/input-form';

const votingModelData = [
    { value: 0, label: 'Vote by Account' },
    { value: 1, label: 'Vote by Account Balance' },
    { value: 2, label: 'Vote by Asset Balance' },
    { value: 3, label: 'Vote by Currency Balance' }
];

class PollForm extends React.Component {
    removeAnswer = (setValue, answers, index) => {
        if (answers && answers.length > 1) {
            answers.splice(index, 1);
            setValue('answers', answers);
        }
    };

    addAnswer = (setValue, answers) => {
        let arrItem = answers === undefined ? 0 : answers.length;
        if (answers === undefined) {
            setValue(`answers[${arrItem}]`, '');
            arrItem = 1;
        }
        setValue(`answers[${arrItem}]`, '');
    };

    selectedBalanceType = (values) => {
        const type = values.minBalanceType || values.votingModel;
        switch (type) {
            case 0:
                return '(none)';
            case 1:
                return '(Apollo)';
            case 2:
                return '(Asset)';
            case 3:
                return '(Currency)';
            default: return null;
        }
    };

    handleVotingModel = (value, setValue) => {
        if (value !== 0) setValue('minBalanceType', 0);
        setValue('minBalanceModel', value);
    };

    render () {
        const {getFormState, setValue, idGroup} = this.props;
        const {values: {minBalanceType, votingModel}} = getFormState()

        return (
            <>
               <TextualInputComponent 
                    label={'Name'}
                    disabled={true}
                    field="name"
                    placeholder="Poll Name"
                    type={"text"}
                    setValue={setValue}
                    isSpecialSymbols
                    idGroup={idGroup}
                />

                <CustomTextArea
                    label={'Description'} 
                    field={'description'} 
                    placeholder={'Description'}
                    setValue={setValue}
                    idGroup={idGroup}
                />

                <CustomFormSelect
                    defaultValue={votingModelData[0]}
                    setValue={setValue}
                    options={votingModelData}
                    label={'Poll By'}
                    field={'votingModel'}
                    idGroup={idGroup}
                />
                
                {
                    minBalanceType === 2 ||
                    votingModel === 2 &&
                    <AssetInput
                        field={'holding'}
                        setValue={setValue}
                        idGroup={idGroup}
                    />
                }
                {
                    minBalanceType === 3 ||
                    votingModel === 3 &&
                    <CurrencyInput 
                        field={'holding'}
                        setValue={setValue}
                        idGroup={idGroup}
                    />
                }
                <BlockHeightInput 
                    label={'Finish height'}
                    field={'finishHeight'}
                    placeholder={'Finish height'}
                    setValue={setValue}
                    idGroup={idGroup}
                />
                
                <div className="form-group row mb-0">
                    <label className="col-sm-3 col-form-label align-self-start">
                        Answer
                    </label>
                    <div className="col-sm-9">
                        <div className="input-group input-group-sm mb-15 no-left-padding">
                            <Text
                                field={'answers[0]'}
                                className="form-control"
                                placeholder={'Answer'}
                            />
                            <div 
                                className="input-group-append"
                                onClick={() => this.removeAnswer(setValue, getFormState().values.answers, 0)}
                            >
                                <span className="input-group-text">
                                    <i className="zmdi zmdi-minus-circle" />
                                </span>
                            </div>
                        </div>
                        {getFormState().values.answers &&
                            getFormState().values.answers.map((el, index) => {
                                if(index !== 0 ) {
                                    const filed = `answers[${index}]`;
                                    return (
                                        <div key={filed}
                                            className="input-group input-group-sm mb-15 no-left-padding">
                                            <Text
                                                id={`${idGroup}${filed}-field`}
                                                field={filed}
                                                className="form-control"
                                                placeholder={'Answer'}
                                            />
                                            <div className="input-group-append"
                                                    onClick={() => this.removeAnswer(setValue, getFormState().values.answers, index)}>
                                                <span className="input-group-text">
                                                    <i className="zmdi zmdi-minus-circle"/>
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                <div className="mobile-class form-group-grey row mb-15">
                    <div className="col-sm-9 offset-sm-3">
                        <a 
                            id={`${idGroup}addAnswer-field`}
                            className="no-margin btn btn-green"
                            onClick={() => this.addAnswer(setValue, getFormState().values.answers)}
                        >
                            Add answer
                        </a>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-sm-6">
                        <CustomInputForm
                            label={'Minimum nr of choices'}
                            setValue={setValue}
                            placeholder={''}
                            field={'minNumberOfOptions'}
                            type={'tel'}
                            idGroup={idGroup}
                            defaultValue={1}
                        />
                        <CustomInputForm
                            label={'Maximum nr of choices'}
                            setValue={setValue}
                            placeholder={''}
                            field={'maxNumberOfOptions'}
                            type={'tel'}
                            idGroup={idGroup}
                            defaultValue={1}
                        />
                    </div>
                    <div className="col-sm-6">
                        <CustomInputForm
                            label={'Minimum range value'}
                            setValue={setValue}
                            placeholder={''}
                            field={'minRangeValue'}
                            type={'tel'}
                            idGroup={idGroup}
                            defaultValue={0}
                        />
                        <CustomInputForm
                            label={'Maximum range value'}
                            setValue={setValue}
                            placeholder={''}
                            field={'maxRangeValue'}
                            type={'tel'}
                            idGroup={idGroup}
                            defaultValue={1}
                        />
                    </div>
                </div>
            </>
            
        )
    }
}

export default PollForm;