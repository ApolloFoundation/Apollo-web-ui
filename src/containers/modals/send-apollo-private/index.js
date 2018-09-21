import React from 'react';
import {connect} from 'react-redux';
import {setModalData, setBodyModalParamsAction, setAlert} from '../../../modules/modals';
import {sendPrivateTransaction} from '../../../actions/transactions';
import AccountRS from '../../components/account-rs';
import classNames from 'classnames';
import crypto from  '../../../helpers/crypto/crypto';
import {calculateFeeAction} from "../../../actions/forms";


import {Form, Text} from 'react-form';
import InfoBox from '../../components/info-box';
import {NotificationManager} from "react-notifications";

class SendApolloPrivate extends React.Component {
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
            feeStatus: false
        }

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }

    async handleFormSubmit(values) {
        const isPassphrase = await this.props.validatePassphrase(values.secretPhrase);

        if (!values.recipient) {
            NotificationManager.error('Recipient not specified.', 'Error', 5000);
            return;
        }
        if (!values.amountATM) {
            NotificationManager.error('Amount is required.', 'Error', 5000);
            return;
        }
        if (!values.feeATM) {
            NotificationManager.error('Fee not specified.', 'Error', 5000);
            return;
        }
        if (!isPassphrase) {
            NotificationManager.error('Incorrect secret phrase', 'Error', 5000);
            return;
        }

        this.props.sendPrivateTransaction(values);
        this.props.setBodyModalParamsAction(null, {});
        NotificationManager.success('Private transaction has been submitted.', null, 5000)
    }

    handleTabChange(tab) {
        this.setState({
            ...this.props,
            activeTab: tab
        })
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

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, values, addValue, removeValue, setValue, getFormState
                             }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Send Apollo</p>
                                </div>
                                <div className="input-group-app form-group mb-15 display-block inline user">
                                    <div className="row form-group-white">
                                        <label className="col-sm-3 col-form-label">
                                            Recipient <i className="zmdi zmdi-portable-wifi-changes"/>
                                        </label>
                                        <div className="col-sm-9">
                                            <div className="iconned-input-field">
                                                <AccountRS
                                                    value={''}
                                                    field={'recipient'}
                                                    setValue={setValue}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Amount
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                        <Text defaultValue={(this.props.modalData && this.props.modalData.amountATM) ? this.props.modalData.amountATM : ''}
                                              className="form-control"
                                              field="amountATM"
                                              placeholder="Amount"
                                              aria-describedby="amountText" />
                                        <div className="input-group-append">
                                            <span className="input-group-text" id="amountText">Apollo</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group row form-group-white mb-15">
                                    <label htmlFor="feeATM" className="col-sm-3 col-form-label">
                                        Fee
                                        <span
                                            onClick={async () => {
                                                    setValue("feeATM", 2);
                                                }
                                            }
                                            style={{paddingRight: 0}}
                                            className="calculate-fee"
                                        >
                                                Calculate</span>
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                        <Text id="feeATM"
                                              field="feeATM"
                                              className="form-control"
                                              value={this.state.feeATM}
                                              placeholder="Amount"
                                              type={"number"}
                                              aria-describedby="feeATMText" />
                                        <div className="input-group-append">
                                            <span className="input-group-text" id="feeATMText">Apollo</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Passphrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text id="secretPhrase" className="form-control" field="secretPhrase" placeholder="secretPhrase" type={'password'}/>
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
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setAlert: (status, message) => dispatch(setAlert(status, message)),
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    sendPrivateTransaction: (requestParams) => dispatch(sendPrivateTransaction(requestParams)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SendApolloPrivate);
