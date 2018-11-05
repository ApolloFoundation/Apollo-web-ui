import React from "react";
import {connect} from "react-redux";
import {Checkbox, Form, Text} from "react-form";
import InputForm from "../../components/input-form";
import ModalFooter from "../../components/modal-footer";

class ShareMessage extends React.Component {
    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({submitForm, values, addValue, removeValue, setValue, getFormState}) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>
                                <div className="form-title">
                                    <p>Share message</p>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label align-self-start">
                                        Shared key
                                    </label>
                                    <div className="col-sm-9">
                                        <Text
                                            field="sharedKey"
                                            type="text"
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label align-self-start">
                                        Transaction
                                    </label>
                                    <div className="col-sm-9">
                                        <a href="#">
                                            1234546543221
                                        </a>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label align-self-start">
                                        Share Link
                                    </label>
                                    <div className="col-sm-9">
                                        <a href="https://en.wikipedia.org/wiki/Blockchain" target="_blank">
                                            https://en.wikipedia.org/wiki/Blockchain
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ShareMessage);