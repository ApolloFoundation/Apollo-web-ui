/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import {Form, Text} from 'react-form';
import AdvancedSettings from '../../components/advanced-transaction-settings';

import AccountRS from '../../components/account-rs';
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import ModalFooter from '../../components/modal-footer'
import FeeCalc from '../../components/form-components/fee-calc';

class TransferAsset extends React.Component {
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
            quantityATU: values.quantityATU * Math.pow(10, this.props.modalData.decimals)
        }

        this.props.processForm(values, 'transferAsset', 'Transfer asset request has been submitted!', () => {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Transfer asset request has been submitted!', null, 5000);
        });
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
                            {
                                this.props.modalData &&

                                <div className="form-group-app">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                    <div className="form-title">
                                        <p>Transfer Asset</p>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Asset</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text defaultValue={this.props.modalData.assetName} type="hidden" field={'name'}/>
                                                <Text defaultValue={this.props.modalData.assetID} type="hidden" field={'asset'}/>
                                                <p>{this.props.modalData.assetName} - {this.props.modalData.availableAssets} available</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom inline user">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Recipient</label>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="iconned-input-field">
                                                    <AccountRS
                                                        field={'recipient'}
                                                        setValue={setValue}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Quantity</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text placeholder={'Quantity'} type="text" field={'quantityATU'}/>
                                            </div>
                                        </div>
                                    </div>
                                    <FeeCalc
                                        values={getFormState().values}
                                        setValue={setValue}
                                        requestType={'transferAsset'}
                                    />
                                    <ModalFooter
                                        setValue={setValue}
                                        getFormState={getFormState}
                                        values={values}
                                    />

                                    <AdvancedSettings
                                        setValue={setValue}
                                        getFormState={getFormState}
                                        values={values}
                                        advancedState={this.state.advancedState}
                                    />

                                    <div className="btn-box align-buttons-inside absolute right-conner">

                                        {
                                            !!this.state.isPending ?
                                                <div
                                                    style={{
                                                        width: 120
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
                                                        width: 120
                                                    }}
                                                    type="submit"
                                                    name={'closeModal'}
                                                    className="btn btn-right blue round round-bottom-right"
                                                >
                                                    Transfer Asset
                                                </button>
                                        }
                                        <a onClick={() => this.props.closeModal()} className="btn btn-right round round-top-left">Cancel</a>
                                    </div>
                                   {/*<div className="btn-box align-buttons-inside absolute left-conner">*/}
                                        {/*<a*/}
                                            {/*onClick={this.handleAdvancedState}*/}
                                            {/*className="btn btn-left round round-bottom-left round-top-right"*/}
                                        {/*>*/}
                                            {/*{this.state.advancedState ? "Basic" : "Advanced"}*/}
                                        {/*</a>*/}
                                    {/*</div>*/}
                                </div>
                            }
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
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferAsset);
