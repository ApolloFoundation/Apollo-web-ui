import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import CustomSelect from '../../components/select/'
import {Form, Text} from 'react-form';
import {getBlockAction} from "../../../actions/blocks";
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import {getShufflingAction} from "../../../actions/shuffling/";

import store from '../../../store'
import crypto from "../../../helpers/crypto/crypto";


class JoinShuffling extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

    }

    handleFormSubmit = async(values) => {

        values = {
            ...values,
            shufflingFullHash: this.state.shuffling.shufflingFullHash,
            registrationPeriod: 1439,
            recipientPublicKey: await crypto.getPublicKey(values.recipientSecretPhrase, false)
        };

        this.props.submitForm(null, null, values, 'startShuffler')
            .done((res) => {
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.setBodyModalParamsAction(null, {});

                    NotificationManager.success('Shuffling Started!', null, 5000);
                }
            })

        // this.props.sendTransaction(values);
        // this.props.setBodyModalParamsAction(null, {});
        // this.props.setAlert('success', 'Transaction has been submitted!');
    };

    getShuffling = async () => {
        const shuffling = await this.props.getShufflingAction({
            shuffling: this.props.modalData
        });

        if (shuffling) {
            this.setState({
                shuffling
            });
        }
    };


    componentDidMount = () => {
        this.setRegisterUntil();
        this.getShuffling();

        NotificationManager.warning('Your passphrase will be sent to the server!', 'Warning', 30000);
        NotificationManager.warning('Use a strong recipient passphrase and do not forget it !', 'Warning', 30000);
        NotificationManager.info('After creating or joining a shuffling, you must keep your node online and your shuffler running, leaving enough funds in your account to cover the shuffling fees, until the shuffling completes! If you don\'t and miss your turn, you will be fined.', 'Attention', 30000);

    };

    handleAdvancedState = () => {
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
    };

    setRegisterUntil = async () => {
        const block = await this.props.getBlockAction();

        if (block) {
            this.setState({
                block
            });
        }
    };

    setAccount = async (getFormState, setValue) => {
        const passphrase = getFormState().values.recipientSecretPhrase;

        const generatedAccount = store.dispatch(await this.props.getAccountIdAsync(passphrase));

        setValue('generatedAccount', generatedAccount);
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, setValue, getFormState
                             }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Start shuffling</p>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Shuffling Id</label>
                                        </div>
                                        <div className="col-md-9">
                                            {
                                                this.state.shuffling &&
                                                <p>{this.state.shuffling.shuffling}</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Recipient Passphrase</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text
                                                field={'recipientSecretPhrase'}
                                                type="password"
                                                onKeyUp={() => this.setAccount(getFormState, setValue)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Recipient Account</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text className={'not-active'} field={'generatedAccount'} type="text" readonly/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Passphrase</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder={'Secret phrase'} type="password" field={'secretPhrase'}/>
                                        </div>
                                    </div>
                                </div>
                                <AdvancedSettings
                                    setValue={setValue}
                                    advancedState={this.state.advancedState}
                                />
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
                                        Start Shuffling
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

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    setModalData: (data) => dispatch(setModalData(data)),
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getAccountIdAsync: (passPhrase) => dispatch(crypto.getAccountIdAsync(passPhrase)),
    getShufflingAction: (reqParams) => dispatch(getShufflingAction(reqParams))
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinShuffling);
