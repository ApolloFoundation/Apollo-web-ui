/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {saveSendModalState, openPrevModal} from '../../../modules/modals';

import {Form, Text} from 'react-form';
import InfoBox from '../../components/info-box';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import BackForm from '../modal-form/modal-form-container';
class BlacklistPeer extends React.Component {
    constructor(props) {
        super(props);
    }

    handleFormSubmit = async (values) => {
        const toSend = {
            adminPassword: values.adminPass,
            peer: this.props.modalData,
            publicKey: this.props.publicKey,
            ecBlockHeight: 0
        };
        const res = await this.props.submitForm( toSend, "blacklistPeer");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Peer has been blacklisted!', null, 5000);
            this.props.closeModal();
        }
    };

    render() {
        return (
            <div className="modal-box">
                <BackForm
	                nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({submitForm, values}) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)} onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>

                                <div className="form-title">
	                                {this.props.modalsHistory.length > 1 &&
	                                <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
	                                }
                                    <p>Blacklist Peer</p>
                                </div>

                                <InfoBox danger mt>
                                    Are you sure you want to blacklist this peer?
                                </InfoBox>

                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Name: </label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                {this.props.modalData}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Admin Password:</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field="adminPass" type='password'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        No
                                    </a>
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Yes
                                    </button>

                                </div>
                            </div>
                        </form>
                    )}
                >

                </BackForm>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    publicKey: state.account.publicKey,
	modalsHistory: state.modals.modalsHistory,

});

const mapDispatchToProps = dispatch => ({
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
	saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),

});

export default connect(mapStateToProps, mapDispatchToProps)(BlacklistPeer);
