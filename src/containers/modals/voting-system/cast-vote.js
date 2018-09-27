/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import InputForm from '../../components/input-form';
import AdvancedSettings from '../../components/advanced-transaction-settings';
import {Form, Text, Number, Checkbox} from 'react-form';
import submitForm from "../../../helpers/forms/forms";
import {getBlockAction} from "../../../actions/blocks";
import {NotificationManager} from "react-notifications";
import {getpollAction} from "../../../actions/polls";
import uuid from "uuid";
import crypto from "../../../helpers/crypto/crypto";

class CastPoll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
            advancedState: false,
            rangeValue: 10,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false,

            answers: [''],
            voteOptions: []
        };
    }

    componentDidMount() {
        this.getPoll()
    }

    getPoll =  async () => {
        const poll = await this.props.getpollAction({
            poll: this.props.modalData
        });

        if (poll && !poll.errorCode) {
            let votes = {};

            Object.values(poll.options).forEach((el, index) => {
                if (index > 9) {
                    votes['vote' + index] = el;
                } else {
                    votes['vote0' + index] = el;
                }
            });

            this.setState({
                poll,
                votes
            });
        }
    };

    handleFormSubmit = async(values) => {
        const isPassphrase = await this.props.validatePassphrase(values.secretPhrase);
        if (!isPassphrase) {
            NotificationManager.error('Incorrect Pass Phrase.', 'Error', 5000);
            return;
        }
        let votes = {};

        if (this.state.poll.maxRangeValue > 1) {
            votes = this.state.voteOptions;
        } else {
            const voteVals = Object.keys(values).filter((el) => {
                return el.includes('vote')
            });

            voteVals.map(vote => {
                values[vote] = values[vote] === true ? 1 : -128;
            });
        }

        values = {
            poll: this.state.poll.poll,
            ...values,
            ...votes,
        };

        this.setState({
            isPending: true
        })

        const res = await this.props.submitForm( values, 'castVote');
        if (res.errorCode) {
            this.setState({
                isPending: true
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Your vote has been cast!!', null, 5000);
        }
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
                        ({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                            <form
                                className="modal-form"
                                onSubmit={submitForm}
                            >
                                {
                                    this.state.poll &&
                                    <div className="form-group-app">
                                        <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                        <div className="form-title">
                                            <p>Cast vote</p>
                                        </div>
                                        <div className="mobile-class form-group row form-group-white mb-15">
                                            <label className="col-sm-3 col-form-label align-self-start">
                                                Poll name
                                            </label>
                                            <div className="col-sm-9 word-brake">
                                                {this.state.poll.name}
                                            </div>
                                        </div>
                                        <div className="mobile-class form-group row form-group-white mb-15">
                                            <label className="col-sm-3 col-form-label align-self-start">
                                                Description
                                            </label>
                                            <div className="col-sm-9">
                                                {this.state.poll.description}
                                            </div>
                                        </div>
                                        <div className="mobile-class form-group row form-group-white mb-0">
                                            <label className="col-sm-3 col-form-label align-self-start">
                                                Select option
                                            </label>
                                            <div className="col-sm-9">
                                                {this.state.poll.maxRangeValue > 1 ?
                                                    <div>
                                                        {Object.keys(this.state.votes).map((el, index) =>
                                                            <div key={uuid()} className={"mb-15"}>
                                                                <p>
                                                                    {this.state.votes[el]}
                                                                    <span
                                                                        className="badge badge-pill badge-primary float-right">
                                                                    {this.state.voteOptions[el]}
                                                                    </span>
                                                                </p>
                                                                <input type="range" className="custom-range"
                                                                       max={this.state.poll.maxRangeValue}
                                                                       min={this.state.poll.minRangeValue}
                                                                       defaultValue={this.state.voteOptions[el] || this.state.poll.minRangeValue}
                                                                       onMouseUp={(event) => this.setState({
                                                                           voteOptions: {
                                                                               [`${el}`]: event.target.value,
                                                                           }
                                                                       })}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    :
                                                    <div className="form-check custom-checkbox">
                                                        {
                                                            Object.keys(this.state.votes).map((el, index) => {
                                                                if (index > 9) {
                                                                    return (
                                                                        <div key={uuid()} className={"mb-15"}>
                                                                            <Checkbox
                                                                                className="form-check-input custom-control-input word-break"
                                                                                field={'vote' + index}
                                                                                style={{opacity: 1}}
                                                                            />
                                                                            <label
                                                                                className="form-check-label custom-control-label">{this.state.votes[el]}</label>
                                                                        </div>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <div key={uuid()} className={"mb-15"}>
                                                                            <Checkbox
                                                                                className="form-check-input custom-control-input"
                                                                                field={'vote0' + index}
                                                                                style={{opacity: 1}}
                                                                            />
                                                                            <label
                                                                                className="form-check-label custom-control-label word-brake">{this.state.votes[el]}</label>
                                                                        </div>
                                                                    );
                                                                }
                                                            })
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group row form-group-white mb-15">
                                            <label className="col-sm-3 col-form-label">
                                                Fee
                                                <span
                                                    onClick={async () => {
                                                            setValue("feeAPL", 1);
                                                    }}
                                                    style={{paddingRight: 0}}
                                                    className="calculate-fee"
                                                >
                                            Calculate
                                        </span>
                                            </label>
                                            <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                                <InputForm
                                                    field="feeAPL"
                                                    placeholder="Amount"
                                                    type={"float"}
                                                    setValue={setValue}/>
                                                <div className="input-group-append">
                                                    <span className="input-group-text">Apollo</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row form-group-white mb-15">
                                            <label className="col-sm-3 col-form-label">
                                                Passphrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>
                                            </label>
                                            <div className="col-sm-9">
                                                <Text className="form-control" field="secretPhrase" placeholder="Secret Phrase" type={'password'}/>
                                            </div>
                                        </div>
                                        <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                            <a
                                                onClick={() => this.props.closeModal()}
                                                className="btn round round-top-left"
                                            >
                                                Cancel
                                            </a>

                                            {
                                                !!this.state.isPending ?
                                                    <div
                                                        style={{
                                                            width: 100
                                                        }}
                                                        className="btn btn-right blue round round-bottom-right"
                                                    >
                                                        <div className="ball-pulse-sync">
                                                            <div></div>
                                                            <div></div>
                                                            <div></div>
                                                        </div>
                                                    </div> :
                                                    <button
                                                        style={{
                                                            width: 100
                                                        }}
                                                        type="submit"
                                                        name={'closeModal'}
                                                        className="btn btn-right blue round round-bottom-right"
                                                    >
                                                        Cast vote
                                                    </button>
                                            }
                                        </div>
                                        {/*<div className="btn-box align-buttons-inside absolute left-conner">
                                            <a
                                                onClick={this.handleAdvancedState}
                                                className="btn btn-right round round-bottom-left round-top-right absolute"
                                                style={{left : 0, right: 'auto'}}
                                            >
                                                {this.state.advancedState ? "Basic" : "Advanced"}
                                            </a>
                                        </div>
                                        <AdvancedSettings
                                            setValue={setValue}
                                            getFormState={getFormState}
                                            values={values}
                                            advancedState={this.state.advancedState}
                                        />*/}

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
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    getpollAction: (reqParams) => dispatch(getpollAction(reqParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CastPoll);
