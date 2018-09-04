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
import {getPoolAction} from "../../../actions/pools";

class CastPoll extends React.Component {
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
        this.getPoll()
    }

    getPoll =  async () => {
        const poll = await this.props.getPoolAction({
            poll: this.props.modalData
        });

        if (poll && !poll.errorCode) {
            let votes = {};

            Object.values(poll.options).forEach((el, index) => {
                if (index > 9) {
                    votes['vote' + index] = el

                } else {
                    votes['vote0' + index] = el
                }
            });

            this.setState({
                poll,
                votes
            });
        }
    };

    handleFormSubmit = async(values) => {
        let resultAnswers = {};

        let votes = {};


        Object.values(this.state.poll.options).forEach((el, index) => {

            if (index > 9) {
                if (values.option === 'vote' + index) {
                    votes['vote' + index] = 1;
                    return;
                }
                votes['vote' + index] = -128

            } else {
                if (values.option === 'vote0' + index) {
                    votes['vote0' + index] = 1;
                    return;
                }
                votes['vote0' + index] = -128
            }
        });

        values = {
            poll: this.state.poll.poll,
            ...values,
            ...votes,
        };

        this.props.submitForm(null, null, values, 'castVote')
            .done((res) => {

                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.setBodyModalParamsAction(null, {});

                    NotificationManager.success('Your vote has been cast!!', null, 5000);
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
                                {
                                    this.state.poll &&
                                    <div className="form-group">
                                        <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                        <div className="form-title">
                                            <p>Cast vote</p>
                                        </div>
                                        <div className="input-group display-block offset-bottom">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Poll name</label>
                                                </div>
                                                <div className="col-md-9">
                                                    {this.state.poll.name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group display-block offset-bottom">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Description</label>
                                                </div>
                                                <div className="col-md-9">
                                                    {this.state.poll.description}
                                                </div>
                                            </div>
                                        </div>
                                        <RadioGroup field={'option'}>
                                            <div className="input-group display-block offset-bottom">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Select option</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <div className="form-sub-actions">
                                                            <div
                                                                className="form-group no-padding-bottom"
                                                                style={{paddingTop:0,paddingLeft:0}}
                                                            >
                                                                {
                                                                    Object.keys(this.state.votes).map((el, index) => {
                                                                        return (
                                                                            <div className="input-group align-middle display-block offset-bottom">
                                                                                <Radio value={el}/>
                                                                                <label style={{display: 'inline-block'}}>{this.state.votes[el]}</label>
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </RadioGroup>

                                        <div className="input-group display-block offset-bottom">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Fee</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <Text field={'feeAPL'} placeholder={'Amount'} type="number"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group display-block offset-bottom">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Passphrase</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <Text placeholder={'Secret phrase'} type="text" field={'secretPhrase'}/>
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

                                    </div>
                                }
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
    getPoolAction: (reqParams) => dispatch(getPoolAction(reqParams))

});

export default connect(mapStateToProps, mapDispatchToProps)(CastPoll);
