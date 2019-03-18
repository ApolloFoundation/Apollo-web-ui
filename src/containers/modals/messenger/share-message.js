import React from "react";
import {connect} from "react-redux";
import {Checkbox, Form, Text} from "react-form";
import InputForm from "../../components/input-form";
import ModalFooter from "../../components/modal-footer";
import {setBodyModalParamsAction} from "../../../modules/modals";

class ShareMessage extends React.Component {
    render() {
        const data = this.props.modalData;
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
                                        Transaction
                                    </label>
                                    <div className="col-sm-9">
                                        <a onClick={() => this.props.setBodyModalParamsAction('INFO_TRANSACTION', data.transaction)}>
                                            {data.transaction}
                                        </a>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label align-self-start">
                                        Share Link
                                    </label>
                                    <div className="col-sm-9">
                                        <a href={`${window.location.protocol}//${window.location.host}?isShareMessage=true&account=${this.props.account}&transaction=${data.transaction}`}
                                           rel="noopener noreferrer"
                                           target="_blank">
                                            {`${window.location.protocol}//${window.location.host}?isShareMessage=true&account=${this.props.account}&transaction=${data.transaction}`}
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

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.accountRS
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShareMessage);