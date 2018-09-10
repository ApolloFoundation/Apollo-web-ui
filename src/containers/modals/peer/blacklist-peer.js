import React from 'react';
import {connect} from 'react-redux';

import {Form, Text} from 'react-form';
import InfoBox from '../../components/info-box';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";

class BlacklistPeer extends React.Component {
    constructor(props) {
        super(props);
    }

    handleFormSubmit = (values) => {
        const toSend = {
            adminPassword: values.adminPass,
            peer: this.props.modalData,
            publicKey: this.props.publicKey,
            ecBlockId: 18338875302302929178,
            ecBlockHeight: 0
        };
        this.props.submitForm(null, null, toSend, "blacklistPeer")
            .done(res => {
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    NotificationManager.success('Peer has been blacklisted!', null, 5000);
                }
            });
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({submitForm}) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>

                                <div className="form-title">
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
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BlacklistPeer);
