/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../../modules/modals';
import {getAliasAction} from "../../../../actions/aliases";
import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import ModalBody from "../../../components/modals/modal-body";

const aliasTypeData = [
    { value: 'uri',     label: 'URI' },
    { value: 'account', label: 'Account' },
    { value: 'general', label: 'Other' },
];

class CancelSell extends React.Component {
    state = {
        alias: {},
        activeTab: 0,
        advancedState: false,

        // submitting
        passphraseStatus: false,
        recipientStatus: false,
        amountStatus: false,
        feeStatus: false
    };

    componentDidMount = () => {
        this.getAlias();
    };

    handleFormSubmit = async (values) => {
        values = {
            ...values,
            recipient: this.state.alias.accountRS,
            aliasName: this.state.alias.aliasName,
            priceATM:  0,

        };

        this.props.processForm(values, 'sellAlias', null, (res) => {
            res = {
                transactionBytes: res.transactionBytes,
                prunableAttachmentJSON: JSON.stringify({...(res.transactionJSON.attachment), priceNQT: 0, uri: undefined, "version.AliasSell":1})
            };

            this.props.processForm(res, 'broadcastTransaction', 'Alias sell has been canceled!', (res) => {
                this.props.setBodyModalParamsAction(null, {});
                NotificationManager.success('Alias sell has been canceled!', null, 5000);
            });
        });
    };

    getAlias = async () => {
        const alias = await this.props.getAliasAction({alias: this.props.modalData});

        if (alias) {
            this.setState({
                alias
            });
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

    handleChange = (value) => {
        this.setState({
            inputType: value
        })
    };

    render() {
        return (
            <ModalBody
                modalTitle={'Cancel Alias Sale'}
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                isFee
                submitButtonName={'Cancel alias sale'}
            >
                <div className="form-group mb-15">
                    <label>
                        Alias
                    </label>
                    <div>
                        <span>{this.state.alias.aliasName}</span>
                    </div>
                </div>
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CancelSell);
