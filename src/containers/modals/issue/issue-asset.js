import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import {NotificationContainer, NotificationManager} from 'react-notifications';


import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import {Form, Text, TextArea, Number} from 'react-form';
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

class IssueAsset extends React.Component {
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



        // Todo: finish form validating
        this.props.submitForm(null, null, values, 'issueAsset')
            .done((res) => {
                console.log('---------------');
                console.log(res);

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
                    render={({ submitForm, values, addValue, removeValue }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group">
                                <div className="form-title">
                                    <p>Issue Asset</p>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Asset name</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Asset name" field="name" type="text"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Description</label>
                                        </div>
                                        <div className="col-md-9">
                                            <TextArea placeholder="Description" field="description" cols="30" rows="10" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Quantity</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Quantity" field="quantityATU" type="number"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Decimals</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Decimals" field="decimals" type="number" min={0} max={8}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Fee</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Fee" field="feeATM" type="text"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Passphrase</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Passphrase" field={'secretPhrase'} type="text"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-box align-buttons-inside absolute right-conner">
                                    <button className="btn btn-right round round-top-left">Cancel</button>
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn absolute btn-right blue round-top-left round-bottom-right"
                                    >
                                        Send
                                    </button>

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

                                <AdvancedSettings advancedState={this.state.advancedState}/>
                                <div className="btn-box align-buttons-inside absolute left-conner">
                                    <a
                                        onClick={this.handleAdvancedState}
                                        className="btn btn-right round round-bottom-left round-top-right"
                                    >
                                        Advanced
                                    </a>
                                </div>
                            </div>
                        </form>
                    )}
                />

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueAsset);
