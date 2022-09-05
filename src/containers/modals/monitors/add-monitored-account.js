import React from 'react';
import BackForm from "../modal-form/modal-form-container";
import {Text} from "react-form";
import {connect} from 'react-redux';
import submitForm from '../../../helpers/forms/forms';

const mapStateToProps = state => ({
    modalData : state.modals.modalData
})

const mapDispatchToProps = dispatch => ({
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType))
})

class AddMonitoredAccount extends React.Component {


    handleFormSubmit = async (values) => {

        values = {
            ...values,
            property: this.props.modalData.property ? this.props.modalData.property : ''
        }

        this.props.submitForm(values, 'setAccountProperty')
            .then((data) => {
                console.log(data);
            })
    }


    render () {
        return (
            <div className="modal-box">
                <BackForm
                    nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, values, addValue, removeValue, setValue, getFormState
                             }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <button type="button" onClick={this.props.closeModal} className="exit"><i className="zmdi zmdi-close" /></button>

                                <div className="form-title">
                                    {
                                        this.props.modalsHistory &&
                                        this.props.modalsHistory.length > 1 &&
                                    <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
                                    }
                                    <p>Start Funding Monitor</p>
                                </div>

                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Property</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                {this.props.modalData.property ? this.props.modalData.property : '?'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Recipient</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <Text

                                                    field={'recipient'}
                                                    placeholder={'Recipient Account'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Amount</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <Text

                                                    field={'amount'}
                                                    placeholder={'Amount'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Threshold</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <Text

                                                    field={'threshold'}
                                                    placeholder={'Threshold'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Interval</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <Text

                                                    field={'interval'}
                                                    placeholder={'Interval'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Fee</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <Text
                                                    field={'feeAPL'}
                                                    placeholder={'Amount'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Secret Phrase</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <Text

                                                    field={'secretPhrase'}
                                                    placeholder={'Secret Phrase'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-box right-conner align-right form-footer">
                                    <button
                                        type={'button'}
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </form>
                        )}
                    />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMonitoredAccount);