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
import FeeCalc from '../../components/form-components/fee-calc';

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
