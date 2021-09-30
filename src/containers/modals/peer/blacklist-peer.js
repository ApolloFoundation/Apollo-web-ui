/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {openPrevModal, saveSendModalState} from '../../../modules/modals';

import {Text} from 'react-form';
import InfoBox from '../../components/info-box';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import BackForm from '../modal-form/modal-form-container';
import classNames from "classnames";

class BlacklistPeer extends React.Component {
    state = {
        isPending: false,
    };

    handleFormSubmit = async (values) => {
        if (!this.state.isPending) {
            this.setState({isPending: true});
            const toSend = {
                adminPassword: values.adminPass,
                peer: this.props.modalData,
                publicKey: this.props.publicKey,
                ecBlockHeight: 0
            };

            await this.props.processForm(toSend, 'blacklistPeer', 'Peer has been blacklisted', () => {
                NotificationManager.success('Peer has been blacklisted!', null, 5000);
                this.props.closeModal();
            });
            this.setState({isPending: false});
        }
    };

    render() {
        return (
            <div className="modal-box">
                <BackForm
                    nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({submitForm, values}) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)}
                              onSubmit={submitForm}>
                            <div className="form-group-app">
                                <button type="button" onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></button>

                                <div className="form-title">
                                    {this.props.modalsHistory.length > 1 &&
                                    <div className={"backMy"} onClick={() => {
                                        this.props.openPrevModal()
                                    }}/>
                                    }
                                    <p>Blacklist Peer</p>
                                </div>

                                <InfoBox className={'light-info'}>
                                    <ul className={'marked-list'}>
                                        <li className={'danger-icon'}>
                                            <strong>Attention!</strong><br/>
                                            Are you sure you want to blacklist this peer?
                                        </li>
                                    </ul>
                                </InfoBox>

                                <div className="form-group mb-15">
                                    <label>
                                        Name:
                                    </label>
                                    <div>
                                        <span>{this.props.modalData}</span>
                                    </div>
                                </div>
                                <div className="form-group mb-15">
                                    <label>
                                        Admin Password:
                                    </label>
                                    <div>
                                        <Text field="adminPass" type='password'/>
                                    </div>
                                </div>
                                <div className="btn-box right-conner align-right form-footer">
                                    <button
                                        type={'button'}
                                        onClick={() => this.props.closeModal()}
                                        className="btn btn-default mr-3"
                                    >
                                        No
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
                                        <span className={'button-text'}>Yes</span>
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
