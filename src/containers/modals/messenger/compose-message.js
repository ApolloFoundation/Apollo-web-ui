import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import {NotificationContainer, NotificationManager} from 'react-notifications';


import AdvancedSettings from '../../components/advanced-transaction-settings';
import AccountRS from '../../components/account-rs';
import InfoBox from '../../components/info-box'
import {Form, Text, TextArea, Number, Checkbox} from 'react-form';
import crypto from '../../../helpers/crypto/crypto';
import {issueAssetAction} from "../../../actions/assets";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {setAlert} from "../../../modules/modals";
import submitForm from "../../../helpers/forms/forms";

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    issueAssetAction: (reqParams) => dispatch(issueAssetAction(reqParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    setAlert: (type, message) => dispatch(setAlert(type, message)),
    validatePassphrase: (passPhrase) => dispatch(crypto.validatePassphrase(passPhrase))
});

class ComposeMessage extends React.Component {
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
        const isPassphrase = await this.props.validatePassphrase(values.secretPhrase);


        // if (!isPassphrase) {
        //     this.setState({
        //         ...this.props,
        //         passphraseStatus: true
        //     });
        //     return;
        // } else {
        //     this.setState({
        //         ...this.props,
        //         passphraseStatus: false
        //     });
        // }

        if (values.messageToEncrypt) {
            values.messageToEncrypt = values.message;
            delete values.message;
        }

        console.log(values);

        // Todo: finish form validating
        this.props.submitForm(null, null, values, 'sendMessage')
            .done((res) => {
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.issueAssetAction(values);
                    this.props.setBodyModalParamsAction(null, {});

                    NotificationManager.success('Asset has been submitted!', null, 5000);

                    // this.props.setAlert('success', 'Transaction has been submitted!');
                }
            })
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

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({ submitForm, values, addValue, removeValue, setValue }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Send message</p>
                                </div>
                                <div className="input-group-app form-group mb-15 display-block inline user">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Recipient</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="iconned-input-field">
                                                <AccountRS
                                                    value={''}
                                                    field={'recipient'}
                                                    defaultValue={(this.props.modalData && this.props.modalData.recipient) ? this.props.modalData.recipient : ''}
                                                    setValue={setValue}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Message</label>
                                        </div>
                                        <div className="col-md-9">
                                            <TextArea placeholder="Message" field="message" cols="30" rows="10" />
                                        </div>
                                    </div>
                                </div>

                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                        </div>
                                        <div className="col-md-9 offset-md-3">
                                            <div className="form-check custom-checkbox mb-2">
                                                <Checkbox className="form-check-input custom-control-input"
                                                          type="checkbox"
                                                          field="messageToEncrypt"/>
                                                <label className="form-check-label custom-control-label">
                                                    Encrypt Message?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/*<div className="input-group-app display-block offset-bottom">*/}
                                    {/*<div className="row">*/}
                                        {/*<div className="col-md-3">*/}
                                        {/*</div>*/}
                                        {/*<div className="col-md-9 offset-md-3">*/}
                                            {/*<div className="form-check custom-checkbox mb-2">*/}
                                                {/*<Checkbox className="form-check-input custom-control-input"*/}
                                                          {/*type="checkbox"*/}
                                                          {/*field="permanent_message"/>*/}
                                                {/*<label className="form-check-label custom-control-label">*/}
                                                    {/*Message is Never Deleted*/}
                                                {/*</label>*/}
                                            {/*</div>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                {/*</div>*/}

                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>File</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="iconned-input-field">
                                                <div className="input-group-app search">
                                                    <div className="iconned-input-field">
                                                        <div className="input-icon text"><i className="">Browse&hellip;</i></div>
                                                        <input
                                                            id="file"
                                                            type="file"
                                                            placeholder="Recipient"
                                                            onChange={(e) => {
                                                                e.preventDefault();

                                                                let reader = new FileReader();
                                                                let file = e.target.files[0];

                                                                reader.onloadend = () => {
                                                                    this.setState({
                                                                        ...this.state,
                                                                        file: file,
                                                                        imagePreviewUrl: reader.result
                                                                    });
                                                                };

                                                                setValue("messageIsText", false);
                                                                setValue("messageIsPrunable", true);

                                                                reader.readAsDataURL(file);

                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Fee</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Fee" field="feeATM" type="number"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Passphrase</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Passphrase" field={'secretPhrase'} type="text"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Send message
                                    </button>
                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </a>

                                </div>
                                <div className="btn-box align-buttons-inside absolute left-conner">
                                    <a
                                        onClick={this.handleAdvancedState}
                                        className="btn btn-right round round-bottom-left round-top-right absolute"
                                        style={{left : 0, right: 'auto'}}
                                    >
                                        Advanced
                                    </a>
                                </div>
                                <AdvancedSettings
                                    setState={setValue}
                                    advancedState={this.state.advancedState}
                                />
                            </div>
                        </form>
                    )}
                />

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComposeMessage);
