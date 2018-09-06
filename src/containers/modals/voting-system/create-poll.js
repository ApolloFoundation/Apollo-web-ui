import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import CustomSelect from '../../components/select';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import {Form, Text, TextArea, Number, Radio, RadioGroup} from 'react-form';
import submitForm from "../../../helpers/forms/forms";
import {getBlockAction} from "../../../actions/blocks";
import {NotificationManager} from "react-notifications";

class CreatePoll extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        activeTab: 0,
        advancedState: false,

        // submitting
        passphraseStatus: false,
        recipientStatus: false,
        amountStatus: false,
        feeStatus: false,

        answers: ['']
    };

    componentDidMount() {
        this.setFinishHeight()
    }

    removeAnswer = (index) => {
        if (index !== 0) {
            let answers = this.state.answers;

            answers.splice(index, 1);

            this.setState({
                answers
            })
        }
    };

    addAnswer = () => {
        let answers = this.state.answers;

        answers.push('');

        this.setState({
            answers
        })
    };

    setFinishHeight = async (setValue) => {
        const block = await this.props.getBlockAction();

        if (block) {
            this.setState({
                block
            });
        }
    };

    handleFormSubmit = async(values) => {

        let resultAnswers = {};

        this.state.answers.forEach((el, index) => {

            if (index > 9) {
                resultAnswers['option' + index] = el;

            } else {
                resultAnswers['option0' + index] = el;
            }
        });

        this.props.submitForm(null, null, {
            ...values,
            'create_poll_answers[]' : this.state.answers[0],
            ...resultAnswers
        }, 'createPoll')
            .done((res) => {

                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.setBodyModalParamsAction(null, {});

                    NotificationManager.success('Your vote has been created!', null, 5000);
                }
            });
    };

    handleAnswerChange = (e, index) => {
        const newAnwer = e.target.value;

        let answers = this.state.answers;

        answers[index] = newAnwer;

        this.setState({
            answers
        })
    };

    handleAdvancedState = () => {
        if (this.state.advancedState) {
            this.setState({
                ...this.props,
                advancedState: false
            })
        } else {
            this.setState({
                ...this.props,
                advancedState: true
            })
        }
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={
                        ({ submitForm, values, addValue, removeValue, setValue }) => (
                            <form
                                className="modal-form"
                                onSubmit={submitForm}
                            >
                                <div className="form-group-app">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                    <div className="form-title">
                                        <p>Create Poll</p>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Name</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text field={'name'} placeholder={'Poll Name'} type="text"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Description</label>
                                            </div>
                                            <div className="col-md-9">
                                                <TextArea placeholder="Description" field="description" cols="30" rows="10" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Poll By</label>
                                            </div>
                                            <div className="col-md-9">
                                                <CustomSelect
                                                    field={'votingModel'}
                                                    setValue={setValue}
                                                    options={[
                                                        { value: '0', label: 'Vote by Account' },
                                                        { value: '1', label: 'Vote by Account Balance' },
                                                        { value: '2', label: 'Vote by Asset Balance' },
                                                        { value: '3', label: 'Vote by Currency Balance' }
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <RadioGroup field={'minBalanceType'}>
                                        <div className="input-group-app display-block offset-bottom">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Min Balance Type</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <div className="form-sub-actions">
                                                        <div
                                                            className="form-group-app no-padding-bottom"
                                                            style={{paddingTop:0,paddingLeft:0}}
                                                        >
                                                            <div className="input-group-app align-middle display-block offset-bottom">
                                                                <Radio value={0}/>
                                                                <label style={{display: 'inline-block'}}>None</label>
                                                            </div>
                                                            <div className="input-group-app align-middle display-block offset-bottom">
                                                                <Radio value={1}/>
                                                                <label style={{display: 'inline-block'}}>Account Balance</label>
                                                            </div>
                                                            <div className="input-group-app align-middle display-block offset-bottom">
                                                                <Radio value={2}/>
                                                                <label style={{display: 'inline-block'}}>Asset Balance</label>
                                                            </div>
                                                            <div className="input-group-app align-middle display-block offset-bottom">
                                                                <Radio value={3}/>
                                                                <label style={{display: 'inline-block'}}>Currency Balance</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Finish Height</label>
                                            </div>
                                            <div className="col-md-9">
                                                <div style={{width: '100%'}} onLoad={(setValue) => {this.setFinishHeight(setValue)}}>
                                                    {
                                                        this.state.block &&
                                                        <Text placeholder="Finish Height" field="finishHeight" defaultValue={parseInt(this.state.block.height) + 10000} step={500} type='number' />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Min voting balance (none)</label>
                                            </div>
                                            <div className="col-md-9">
                                                <div style={{width: '100%'}}>
                                                    <Text placeholder="" field="minBalanceATUf" type='number' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Answer</label>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="iconned-input-field" style={{width: '100%'}}>
                                                    {
                                                        this.state.answers.map((el, index) => {
                                                            if (index === 0) {
                                                                return (
                                                                    <div key={'answer-' + index} className="input-group-app search" style={{display: 'block'}}>
                                                                        <div className="iconned-input-field">
                                                                            <input name={'create_poll_answers[]'} onChange={(e) => this.handleAnswerChange(e, index)} value={el} placeholder={'Answer'} type="text"/>
                                                                            <a onClick={() => this.removeAnswer(index)} className="input-icon"><i className="zmdi zmdi-minus-circle" /></a>
                                                                        </div>
                                                                    </div>
                                                                )

                                                            } else {
                                                                return (
                                                                    <div key={'answer-' + index} className="input-group-app search" style={{display: 'block', marginTop: 25}}>
                                                                        <div className="iconned-input-field">
                                                                            <input name={'create_poll_answers[]'} onChange={(e) => this.handleAnswerChange(e, index)} value={el} placeholder={'Answer'} type="text"/>
                                                                            <a onClick={() => this.removeAnswer(index)} className="input-icon"><i className="zmdi zmdi-minus-circle" /></a>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }

                                                        })
                                                    }
                                                    <div className="input-group-app" style={{display: 'block', marginTop: 25}}>
                                                        <a
                                                            onClick={() => this.addAnswer()}
                                                            className="no-margin btn static blue"
                                                        >
                                                            Add answer
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Minimum nr of choices</label>
                                            </div>
                                            <div className="col-md-3">
                                                <div style={{width: '100%'}}>
                                                    <Text placeholder="" field="minNumberOfOptions" type='number' />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <label>Maximum nr of choices</label>
                                            </div>
                                            <div className="col-md-3">
                                                <div style={{width: '100%'}}>
                                                    <Text placeholder="" field="maxNumberOfOptions" type='number' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Minimum range value</label>
                                            </div>
                                            <div className="col-md-3">
                                                <div style={{width: '100%'}}>
                                                    <Text placeholder="" field="minRangeValue" type='number' />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <label>Maximum range value</label>
                                            </div>
                                            <div className="col-md-3">
                                                <div style={{width: '100%'}}>
                                                    <Text placeholder="" field="maxRangeValue" type='number' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Fee</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text field={'feeAPL'} placeholder={'Amount'} type="text"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Passphrase</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text placeholder={'Secret phrase'} type={'password'} field={'secretPhrase'}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                        <a
                                            onClick={() => this.props.closeModal()}
                                            className="btn round round-top-left"
                                        >
                                            Cancel
                                        </a>
                                        <button
                                            type="submit"
                                            name={'closeModal'}
                                            className="btn btn-right blue round round-bottom-right"
                                        >
                                            Send
                                        </button>
                                    </div>
                                    <div className="btn-box align-buttons-inside absolute left-conner">
                                        <a
                                            onClick={this.handleAdvancedState}
                                            className="btn btn-right round round-bottom-left round-top-right absolute"
                                            style={{left : 0, right: 'auto'}}
                                        >
                                            Advanced
                                        </a>
                                    </div>
                                    <AdvancedSettings advancedState={this.state.advancedState}/>

                                </div>
                            </form>
                        )}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    getBlockAction: (data) => dispatch(getBlockAction(data)),
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),

});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePoll);
