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
import classNames from "classnames";

class ConnectPeer extends React.Component {
    state = {
        isPending: false,
    };

    handleFormSubmit = async (values) => {
        if (!this.state.isPending) {
            this.setState({isPending: true});
            const toSend = {
                adminPassword: values.adminPassword,
                peer: this.props.modalData || values.peer,
            };
            const res = await this.props.submitForm(toSend, "addPeer");
            if (res.errorCode) {
                NotificationManager.error(res.errorDescription, 'Error', 5000)
            } else {
                NotificationManager.success('Peer has been conected!', null, 5000);
                this.props.closeModal();
            }
            this.setState({isPending: false});
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
                                <button type="button" onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></button>

                                <div className="form-title">
                                    <p>{this.props.modalData ? 'Connect Peer' : 'Add Peer'}</p>
                                </div>
                                <div className="form-group mb-15">
                                    <label>
                                        Address
                                    </label>
                                    <div>
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
                                <div className="form-group mb-15">
                                    <label>
                                        Admin Password
                                    </label>
                                    <div>
                                        <Text className="form-control"
                                              field="adminPassword"
                                              placeholder="Admin Password"
                                              type={'password'}/>
                                    </div>
                                </div>
                                <div className="btn-box right-conner align-right form-footer">
                                    <button
                                        type={'button'}
                                        onClick={() => this.props.closeModal()}
                                        className="btn btn-default mr-3"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className={classNames({
                                            "btn btn-green submit-button": true,
                                            "loading btn-green-disabled": this.state.isPending,
                                        })}
                                    >
                                        <div className="button-loader">
                                            <div className="ball-pulse">
                                                <div/>
                                                <div/>
                                                <div/>
                                            </div>
                                        </div>
                                        <span className={'button-text'}>Send</span>
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
