import React from 'react';

import {Text} from 'react-form';
import {CheckboxFormInput} from '../../../components/form-components/check-button-input';
import TextualInputComponent from '../../../components/form-components/textual-input';
import NumericInputComponent from '../../../components/form-components/numeric-input';
import CustomTextArea from '../../../components/form-components/text-area';
import CustomFormSelect from '../../../components/form-components/custom-form-select';

import AssetInput from '../../../components/form-components/asset-input';
import CurrencyInput from '../../../components/form-components/currency-input';

import BlockHeightInput from '../../../components/form-components/block-height-input';

import InputForm from '../../../components/input-form';
import ModalBody from '../../../components/modals/modal-body';

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
        const {getFormState, setValue} = this.props;
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
                />

                <CustomTextArea
                    label={'Description'} 
                    field={'description'} 
                    placeholder={'Description'}
                    setValue={setValue}
                />

                <CustomFormSelect
                    defaultValue={votingModelData[0]}
                    setValue={setValue}
                    options={votingModelData}
                    label={'Poll By'}
                    field={'votingModel'}
                />
                
                {
                    minBalanceType === 2 ||
                    votingModel === 2 &&
                    <AssetInput
                        field={'create_poll_asset_id'}
                        setValue={setValue}
                    />
                }
                {
                    minBalanceType === 3 ||
                    votingModel === 3 &&
                    <CurrencyInput 
                        field={'create_poll_ms_code'}
                        setValue={setValue}
                    />
                }
                {/*{getFormState().values.votingModel === votingModelData[0].value &&
                <RadioGroup field={'minBalanceType'} defaultValue={0}>
                    <div className="form-group row form-group-white">
                        <label className="col-sm-3 col-form-label align-self-start">
                            Min Balance Type
                        </label>
                        <div className="col-md-9">
                            <div className="form-sub-actions">
                                <div
                                    className="form-group-app no-padding-bottom"
                                    style={{paddingTop: 0, paddingLeft: 0}}
                                >
                                    <div
                                        className="input-group-app align-middle display-block mb-3">
                                        <Radio value={0}/>
                                        <label style={{display: 'inline-block'}}>None</label>
                                    </div>
                                    <div
                                        className="input-group-app align-middle display-block mb-3">
                                        <Radio value={1}/>
                                        <label style={{display: 'inline-block'}}>Account
                                            Balance</label>
                                    </div>
                                    <div
                                        className="input-group-app align-middle display-block mb-3">
                                        <Radio value={2}/>
                                        <label style={{display: 'inline-block'}}>Asset
                                            Balance</label>
                                    </div>
                                    <div
                                        className="input-group-app align-middle display-block mb-3">
                                        <Radio value={3}/>
                                        <label style={{display: 'inline-block'}}>Currency
                                            Balance</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </RadioGroup>
                }
                <div className="form-group row form-group-white mb-15">
                    <label className="col-sm-3 col-form-label">
                        Min voting balance {this.selectedBalanceType(getFormState().values)}
                    </label>
                    <div className="col-sm-9">
                        <InputForm
                            disabled={getFormState().values.minBalanceType === 0 &&
                                        getFormState().values.votingModel === 0}
                            field="minBalance"
                            placeholder=""
                            type={"tel"}
                            defaultValue={0}
                            setValue={setValue}/>
                    </div>
                </div>*/}
                <BlockHeightInput 
                    label={'Finish height'}
                    field={'finishHeight'}
                    placeholder={'Finish height'}
                    setValue={setValue}
                />
                
                <div className="form-group row form-group-white mb-0">
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
                            <div className="input-group-append"
                                    onClick={() => this.removeAnswer(setValue, getFormState().values.answers, 0)}>
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
                        <a className="no-margin btn static blue"
                            onClick={() => this.addAnswer(setValue, getFormState().values.answers)}>
                            Add answer
                        </a>
                    </div>
                </div>
                
                <div className="form-group row form-group-white mb-15">
                    <label className="col-sm-3 col-form-label align-self-start">
                        Minimum nr of choices
                    </label>
                    <div className="col-sm-3">
                        <InputForm
                            defaultValue={1}
                            type="tel"
                            field="minNumberOfOptions"
                            placeholder=""
                            setValue={setValue}/>
                    </div>
                    <label className="col-sm-3 col-form-label align-self-start">
                        Maximum nr of choices
                    </label>
                    <div className="col-sm-3">
                        <InputForm
                            defaultValue={1}
                            type="tel"
                            field="maxNumberOfOptions"
                            placeholder=""
                            setValue={setValue}/>
                    </div>
                </div>
                <div className="form-group row form-group-white mb-15">
                    <label className="col-sm-3 col-form-label align-self-start">
                        Minimum range value
                    </label>
                    <div className="col-sm-3">
                        <InputForm
                            defaultValue={0}
                            type="tel"
                            field="minRangeValue"
                            placeholder=""
                            setValue={setValue}/>
                    </div>
                    <label className="col-sm-3 col-form-label align-self-start">
                        Maximum range value
                    </label>
                    <div className="col-sm-3">
                        <InputForm
                            defaultValue={1}
                            type="tel"
                            field="maxRangeValue"
                            placeholder=""
                            setValue={setValue}/>
                    </div>
                </div>
            </>
            
        )
    }
}

export default PollForm;