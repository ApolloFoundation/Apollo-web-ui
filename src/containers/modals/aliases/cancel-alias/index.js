/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../../modules/modals';
import {getAliasAction} from '../../../../actions/aliases/';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";
import ModalBody from '../../../components/modals/modal-body';
import CancelSaleForm from './form';

const typeData = [
    { value: 'uri',     label: 'URI' },
    { value: 'account', label: 'Account' },
    { value: 'general', label: 'Other' },
];

class CancelSaleAlias extends React.Component {
	constructor(props) {
		super(props);

		this.handleFormSubmit = this.handleFormSubmit.bind(this);

		this.state = {
			activeTab: 0,
			advancedState: false,
			inputType: 'uri',

			// submitting
			passphraseStatus: false,
			recipientStatus: false,
			amountStatus: false,
			feeStatus: false
		};

		this.handleTabChange = this.handleTabChange.bind(this);
		this.handleAdvancedState = this.handleAdvancedState.bind(this);
	}

	componentDidMount = () => {
		this.getAlias();
	};

	async handleFormSubmit(values) {
		values = {
			...values,
			aliasName: this.state.alias.aliasName
		};

		this.props.processForm(values, 'setAlias', 'Product has been listed!', () => {
			this.props.setBodyModalParamsAction(null, {});
			NotificationManager.success('Product has been listed!', null, 5000);
		});
	}

	getAlias = async () => {
		const alias = await this.props.getAliasAction({alias: this.props.modalData});

		if (alias) {
			this.setState({
				alias
			});
		}
	};

	handleTabChange(tab) {
		this.setState({
			...this.props,
			activeTab: tab
		})
	}

	handleAdvancedState() {
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
	}

	handleChange = (value) => {
		this.setState({
			inputType: value
		})
	};

	render() {
		return (
			<ModalBody
                loadForm={this.loadForm}
                modalTitle={'Cancel Sale Alias'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Cancel Sale'}
            >
                <CancelSaleForm />
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

export default connect(mapStateToProps, mapDispatchToProps)(CancelSaleAlias);
