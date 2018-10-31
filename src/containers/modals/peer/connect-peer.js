/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';

import {Form, Text} from 'react-form';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import InputForm from '../../components/input-form';

class ConnectPeer extends React.Component {
    constructor(props) {
        super(props);
    }

    handleFormSubmit = async (values) => {
        const toSend = {
            adminPassword: values.adminPassword,
            peer: this.props.modalData || values.peer,
        };
        const res = await this.props.submitForm( toSend, "addPeer");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Peer has been conected!', null, 5000);
            this.props.closeModal();
        }
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({submitForm, setValue}) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>

                                <div className="form-title">
                                    <p>{this.props.modalData ? 'Connect Peer' : 'Add Peer'}</p>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Address
                                    </label>
                                    <div className="col-sm-9">
                                        {this.props.modalData ?
                                            <div className="input-wrapper">
                                                {this.props.modalData}
                                            </div>
                                            :
                                            <InputForm
                                                field="peer"
                                                placeholder="Peer Address"
                                                setValue={setValue}/>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Admin Password
                                    </label>
                                    <div className="col-sm-9">
                                        <Text className="form-control"
                                              field="adminPassword"
                                              placeholder="Admin Password"
                                              type={'password'}/>
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
    modalData: state.modals.modalData,
    publicKey: state.account.publicKey

});

const mapDispatchToProps = dispatch => ({
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectPeer);
