/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import {NotificationManager} from 'react-notifications';

import crypto from '../../../helpers/crypto/crypto';
import {issueAssetAction} from "../../../actions/assets";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {setAlert} from "../../../modules/modals";
import submitForm from "../../../helpers/forms/forms";

import ModalBody from '../../components/modals/modal-body';
import TextualInputComponent from '../../components/form-components/textual-input';
import CustomTextArea from '../../components/form-components/text-area';
import NummericInputForm from '../../components/form-components/numeric-input'


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
// TODO update
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
        if (!this.state.isPending) {
            this.setState({isPending: true});
            values = {
                ...values,
                quantityATU: values.quantityATU * Math.pow(10, values.decimals)
            };

            await this.props.processForm(values, 'issueAsset', 'Transaction has been submitted!', () => {
                this.props.setBodyModalParamsAction(null, {});
                NotificationManager.success('Asset has been submitted!', null, 5000);
            });
            this.setState({isPending: false});
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
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Issue Asset'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Issue Asset'}
				idGroup={'issue-asset-modal-'}
            >
                <TextualInputComponent
                    label={'Asset name'}
                    placeholder={'Asset name'}
                    field={'name'}
                />
                <CustomTextArea
                    label={'Description'}
                    placeholder={'Description'}
                    field={'description'}
                />
                <NummericInputForm
                    label={'Quantity'}
                    placeholder={'Quantity'}
                    field={'quantityATU'}
                />
                <NummericInputForm
                    label={'Decimals'}
                    placeholder={'Decimals'}
                    field={'decimals'}
                />
            </ModalBody>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueAsset);
