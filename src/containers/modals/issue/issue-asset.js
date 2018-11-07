/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


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
import ModalFooter from '../../components/modal-footer'

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    issueAssetAction: (reqParams) => dispatch(issueAssetAction(reqParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
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

        values = {
            ...values,
            quantityATU: values.quantityATU * Math.pow(10, values.decimals)
        };

        this.setState({
            isPending: true
        })

        // Todo: finish form validating
        const res = await this.props.submitForm( values, 'issueAsset');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.issueAssetAction(values);
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Asset has been submitted!', null, 5000);

            // this.props.setAlert('success', 'Transaction has been submitted!');
        }
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
                    render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Issue Asset</p>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Asset name</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Asset name" field="name" type="text"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Description</label>
                                        </div>
                                        <div className="col-md-9">
                                            <TextArea placeholder="Description" field="description" cols="30" rows="10" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Quantity</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Quantity" field="quantityATU" type="tel"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Decimals</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Decimals" field="decimals" type="tel" min={0} max={8}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Fee</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Fee" field="feeATM" type="tel"/>
                                        </div>
                                    </div>
                                </div>
                                <ModalFooter
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                />
                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    {
                                        !!this.state.isPending ?
                                            <div
                                                style={{
                                                    width: 116.25
                                                }}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                <div className="ball-pulse">
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div> :
                                            <button
                                                style={{
                                                    width: 116.25
                                                }}
                                                type="submit"
                                                name={'closeModal'}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                Issue asset
                                            </button>
                                    }
                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </a>

                                </div>
                                {/*<div className="btn-box align-buttons-inside absolute left-conner">*/}
                                    {/*{*/}
                                        {/*this.state.advancedState &&*/}
                                        {/*<a*/}
                                            {/*onClick={this.handleAdvancedState}*/}
                                            {/*className="btn btn-right round round-bottom-left round-top-right absolute"*/}
                                            {/*style={{left : 0, right: 'auto'}}*/}
                                        {/*>*/}
                                            {/*Basic*/}
                                        {/*</a>*/}
                                    {/*}*/}
                                    {/*{*/}
                                        {/*!this.state.advancedState &&*/}
                                        {/*<a*/}
                                            {/*onClick={this.handleAdvancedState}*/}
                                            {/*className="btn btn-right round round-bottom-left round-top-right absolute"*/}
                                            {/*style={{left : 0, right: 'auto'}}*/}
                                        {/*>*/}
                                            {/*Advanced*/}
                                        {/*</a>*/}
                                    {/*}*/}

                                {/*</div>*/}
                                <AdvancedSettings
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
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

export default connect(mapStateToProps, mapDispatchToProps)(IssueAsset);
