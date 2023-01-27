import React, {Component} from "react";
import {connect} from "react-redux";
import {setBodyModalParamsAction} from "modules/modals";
import {getTransactionsID} from "actions/transactions";
import {getShufflingAction} from "actions/shuffling";
import {getTransactionAction} from "actions/transactions";

class ShufflingRecipients extends Component {
	componentDidMount = () => {
		this.getCurrency();
		this.getIDTransactions();
		if(this.props.transaction.attachment.shuffling){
			this.getTransaction(this.props.transaction.attachment.shuffling);
		}
	};

	state = {};

	async getIDTransactions() {
		const accounts = this.props.transaction.attachment.recipientPublicKeys.map(el => {
			return this.props.getTransactionsID({publicKey: el});
		});

		Promise.all(accounts)
			.then(data => {
					this.setState({
						recipients: data
					});
				}
			);
	}

	getTransaction = async (data) => {
		const reqParams = {
			transaction: data,
			account: this.props.account
		};

		const transaction = await this.props.getTransactionAction(reqParams);

		if (transaction) {
			this.setState({transactionShuffling: transaction});
		}

	};

	getCurrency = async () => {
		const shuffling = await this.props.getShufflingAction({shuffling: this.props.transaction.attachment.shuffling});
		if (shuffling) {
			this.setState({
				shuffling
			});
		}
	};

	render() {
		return (
			<React.Fragment>
				{this.props.transaction.attachment.hasOwnProperty("shufflingStateHash") &&
				<tr>
					<td>Shuffling State Hash:</td>
					<td>{this.props.transaction.attachment.shufflingStateHash}</td>
				</tr>
				}
				{this.props.transaction.attachment.hasOwnProperty("shuffling") &&
				<tr>
					<td>Shuffling:</td>
					<td className="blue-link-text"><a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_TRANSACTION', this.state.transactionShuffling)}>{this.props.transaction.attachment.shuffling}</a></td>
				</tr>
				}
				{this.props.transaction.attachment.hasOwnProperty("recipientPublicKeys") &&
				<tr>
					<td>Recipients:</td>
					<td className={"blue-link-text"}>{this.state.recipients && this.state.recipients.map(item =>
						<div className={"table-item"}>
							<a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', item.account)}>
								{item.accountRS}
							</a>
						</div>)}
					</td>
				</tr>
				}

			</React.Fragment>
		);
	}
}

const mapDispatchToProps = {
	getShufflingAction,
	setBodyModalParamsAction,
	getTransactionsID,
	getTransactionAction,
};

export default connect(null, mapDispatchToProps)(ShufflingRecipients);