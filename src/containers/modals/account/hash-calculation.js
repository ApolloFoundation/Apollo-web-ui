import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import converters from '../../../helpers/converters';
import classNames from 'classnames';

import {Form, Text, TextArea, Checkbox, Select} from 'react-form';
import InfoBox from '../../components/info-box';
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";

class HashCalculation extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false,
            generatedHash: false,
        };
        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }

    async handleFormSubmit(values) {
        console.warn(values);
        this.props.submitForm(null, null, {
            secret: values.data,
            secretIsText: values.isMessage,
            hashAlgorithm: values.alg,
            feeATM: 0
        }, 'hash')
            .done(res => {
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, "Error", 5000)
                } else {
                    this.setState({
                        generatedHash: res.hash
                    });
                }
            });
    }

    handleAdvancedState() {
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
    }

    hashOptions = [
        {
            label: "SHA256",
            value: "2"
        },
        {
            label: "SHA3",
            value: "3",
        },
        {
            label: "SCRYPT",
            value: "5",
        },
        {
            label: "RIPEMD160",
            value: "6"
        },
        {
            label: "Keccak25",
            value: "25"
        },
        {
            label: "RIPEMD160_SHA256",
            value: "62"
        }
    ];

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm
                             }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>

                                <div className="form-title">
                                    <p>Hash calculation</p>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Data</label>
                                        </div>
                                        <div className="col-md-9">
                                            <TextArea rows={5} field="data" placeholder="Data to hash"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3"/>
                                        <div className="input-group align-middle display-block offset-bottom">
                                            <Checkbox style={{display: 'inline-block'}} type="checkbox"
                                                      field="isMessage"/>
                                            <label style={{display: 'inline-block'}}>Textual data representation</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <Select field="alg" options={this.hashOptions}/>
                                        </div>
                                    </div>
                                </div>

                                {
                                    this.state.passphraseStatus &&
                                    <InfoBox danger mt>
                                        Incorrect passphrase.
                                    </InfoBox>
                                }
                                {
                                    this.state.recipientStatus &&
                                    <InfoBox danger mt>
                                        Incorrect recipient.
                                    </InfoBox>
                                }
                                {
                                    this.state.amountStatus &&
                                    <InfoBox danger mt>
                                        Missing amount.
                                    </InfoBox>
                                }
                                {
                                    this.state.feeStatus &&
                                    <InfoBox danger mt>
                                        Missing fee.
                                    </InfoBox>
                                }
                                {this.state.generatedHash ?
                                    <InfoBox info>
                                        {this.state.generatedHash}
                                    </InfoBox> : null}
                                <div className="btn-box align-buttons-inside absolute right-conner">
                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className="btn btn-right round round-top-left"
                                    >
                                        Cancel
                                    </a>
                                    <a onClick={() => this.props.closeModal()} className="btn btn-right round round-top-left">Cancel</a>
                                </div>

                                <div className="btn-box align-buttons-inside absolute left-conner">
                                    <button
                                        className="btn btn-right blue round round-bottom-right"
                                        type="submit"
                                    >
                                        Calculate
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                >

                </Form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),

});

export default connect(mapStateToProps, mapDispatchToProps)(HashCalculation);
