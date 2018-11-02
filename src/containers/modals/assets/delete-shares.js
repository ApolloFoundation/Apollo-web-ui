/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import {NotificationManager} from "react-notifications";
import {Form, Text} from 'react-form';
import submitForm from "../../../helpers/forms/forms";
import ModalFooter from '../../components/modal-footer'

class DeleteShares extends React.Component {
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
        };

        this.setState({
            isPending: true
        })

        const res = await this.props.submitForm( values, 'deleteAssetShares');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Delete asset request has been submitted!', null, 5000);
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
                            {
                                this.props.modalData &&
                                <div className="form-group-app">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>
                                    <div className="form-title">
                                        <p>Delete Asset</p>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Asset</label>
                                            </div>
                                            <div className="col-md-9">
                                                <p>{this.props.modalData.assetName} - {this.props.modalData.quantityATU / 100000000} availiable</p>
                                                <Text defaultValue={this.props.modalData.assetName} type="hidden" field={'name'}/>
                                                <Text defaultValue={this.props.modalData.assetID} type="hidden" field={'asset'}/>
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
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Fee</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text placeholder={'Amount'} type="text" field={'feeATM'}/>
                                            </div>
                                        </div>
                                    </div>
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
                                                        width: 56.25
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

                                                    type="submit"
                                                    name={'closeModal'}
                                                    className="btn btn-right blue round round-bottom-right"
                                                >
                                                    Delete
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
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteShares);
