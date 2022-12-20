/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {openPrevModal, saveSendModalState, setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import submitForm from "../../../helpers/forms/forms";
import {getBlockAction} from "../../../actions/blocks";
import {getCurrencyAction} from "../../../actions/currencies";
import {getAssetAction} from "../../../actions/assets";
import {NotificationManager} from "react-notifications";
import {calculateFeeAction} from "../../../actions/forms";
import InfoBox from "../../components/info-box";
import crypto from "../../../helpers/crypto/crypto";
import ModalFooter from '../../components/modal-footer'
import FeeCalc from '../../components/form-components/fee-calc';

import BackForm from '../modal-form/modal-form-container';
import ButtonWrapper from "../mandatory-approval/components/ModalFooter";
import classNames from "classnames";
// TODO update
class OrderCancel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
            advancedState: false,
            isPending: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false,

            answers: [''],
            currency: '-',
            asset: 'Not Existing',
        }
        console.log('tsx')
    }

    handleFormSubmit = async (values) => {
        if (!this.state.isPending) {
            this.setState({isPending: true});
            const {modalData} = this.props;

            values.publicKey = await crypto.getPublicKeyAPL(values.secretPhrase);
            const res = await this.props.submitForm({
                ...values,
                order: modalData.order,
                phased: false,
                deadline: 0,
                phasingHashedSecretAlgorithm: 2,
            }, modalData.type === 'bid' ? 'cancelBidOrder' : modalData.type === 'ask' ? 'cancelAskOrder' : modalData.type);
            if (res.errorCode) {
                NotificationManager.error(res.errorDescription, 'Error', 5000)
            } else {
                this.props.setBodyModalParamsAction(null, {});
                NotificationManager.success('Your order has been canceled!', null, 5000);
            }
            this.setState({isPending: false});
        }
    };

    handleAdvancedState = () => {
        if (this.state.advancedState) {
            this.setState({
                advancedState: false
            })
        } else {
            this.setState({
                advancedState: true
            })
        }
    };

    render() {
        return (
            <div className="modal-box">
                <BackForm
                    nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={
                        ({submitForm, values, addValue, removeValue, setValue, getFormState}) => (
                            <form
                                className="modal-form"
                                onChange={() => this.props.saveSendModalState(values)}
                                onSubmit={submitForm}
                            >
                                <div className="form-group-app">
                                    <button type="button" onClick={() => this.props.closeModal()} className="exit"><i
                                        className="zmdi zmdi-close"/></button>
                                    <div className="form-title">
                                        {this.props.modalsHistory.length > 1 &&
                                        <div className={"backMy"} onClick={() => {
                                            this.props.openPrevModal()
                                        }}/>
                                        }
                                        <p>Confirm Order Cancellation</p>
                                    </div>
                                    <InfoBox default>
                                        If you are sure you want to cancel your order, type your passphrase to confirm.
                                    </InfoBox>
                                    <FeeCalc
                                        values={getFormState().values}
                                        setValue={setValue}
                                        requestType={'issueAsset'}
                                    />
                                    <ModalFooter
                                        setValue={setValue}
                                        getFormState={getFormState}
                                        values={values}
                                    />
                                    <ButtonWrapper>
                                        <button
                                            type={'button'}
                                            onClick={() => this.props.closeModal()}
                                            className="btn btn-default mr-3"
                                        >
                                            No, do not cancel
                                        </button>
                                        <button
                                            type="submit"
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
                                            <span className={'button-text'}>Cancel my order</span>
                                        </button>
                                    </ButtonWrapper>
                                </div>
                            </form>
                        )}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    getBlockAction: (data) => dispatch(getBlockAction(data)),
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams)),
    getCurrencyAction: (requestParams) => dispatch(getCurrencyAction(requestParams)),
    getAssetAction: (requestParams) => dispatch(getAssetAction(requestParams)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
    openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderCancel);
