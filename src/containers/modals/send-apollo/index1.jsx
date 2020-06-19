/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState } from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../modules/modals';
import submitForm from "../../../helpers/forms/forms";

// Form components
import {NotificationManager} from 'react-notifications';

import ModalBody from '../../components/modals/modal-body';
import SendApolloForm from './form';

export default function SendApollo () {
  const [activeTab, setActiveTab] = useState(0);
  const [advancedState, setAdvancedState] = useState(false);
  const [passphraseStatus, setPassphraseStatus] = useState(false);
  const [recipientStatus, setRecipientStatus] = useState(false);
  const [amountStatus, setAmountStatus] = useState(false);
  const [feeStatus, setFeeStatus] = useState(false);
  const [alias, setAlias] = useState(null);

	const handleFormSubmit = useCallback( async values => {
		const {dashboardForm} = this.props;

		if (!values.secretPhrase || values.secretPhrase.length === 0) {
			NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
			return;
		}

		if (values.doNotSign) {
			values.publicKey = await crypto.getPublicKeyAPL(this.props.account, true);
			delete values.secretPhrase;
		}

		if (values.phasingFinishHeight) {
			values.phased = true;
		}

		if (values.alias) {
			values.recipient = this.state.alias;
		}

        // export const processForm = (values, requestType, successMesage, successCallback) => {

		this.props.processForm(values, 'sendMoney', 'Transaction has been submitted!', (res) => {
			if (res.broadcasted === false) {
					this.props.setBodyModalParamsAction('RAW_TRANSACTION_DETAILS', {
							request: values,
							result: res
					});
			} else {
					this.props.setBodyModalParamsAction(null, {});
			}

			if (dashboardForm) {
					dashboardForm.resetAll();
					dashboardForm.setValue('recipient', '');
					dashboardForm.setValue('feeATM', '1');
			}
			NotificationManager.success('Transaction has been submitted!', null, 5000);
		});
	}, []);

	onChosenTransactionOnAlias = () => {this.setState({alias: null})}

	handelChangeAlias = ({value}) => {this.setState({alias: value})}

	render() {
		return (
			<ModalBody
				modalTitle={'Create transaction'}
				closeModal={this.props.closeModal}
				handleFormSubmit={(values) => this.handleFormSubmit(values)}
				isFee
				isAdvanced
				submitButtonName={'Send'}
				idGroup={'send-money-modal-'}
			>

				<SendApolloForm onChangeAlias={this.handelChangeAlias} onChosenTransactionOnAlias={this.onChosenTransactionOnAlias} />

			</ModalBody>

		);
	}
}

const mapStateToProps = ({modals, account}) => ({
	modalData: modals.modalData,
	account: account.account,
	publicKey: account.publicKey,
	modalsHistory: modals.modalsHistory,
	dashboardForm: modals.dashboardForm,
});

const mapDispatchToProps = dispatch => ({
	submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
	setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
	validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
	getPublicKeyAPL: (passphrase) => dispatch(crypto.getPublicKeyAPL(passphrase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SendApollo);
