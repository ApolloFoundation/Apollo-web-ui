import React, {Component} from "react";
import {connect} from "react-redux";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {getShufflingAction} from "../../../../actions/shuffling";
import {getTransactionAction} from "../../../../actions/transactions";

class ShufflingProcessing extends Component {
	componentDidMount = () => {
		this.getCurrency();
		if(this.props.transaction.attachment.shuffling){
			this.getTransaction(this.props.transaction.attachment.shuffling);
		}
	};

	state = {};

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
				{this.props.transaction.attachment.hasOwnProperty("shuffling") &&
				<tr>
					<td>Shuffling:</td>
					<td className="blue-link-text"><a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_TRANSACTION', this.state.transactionShuffling)}>{this.props.transaction.attachment.shuffling}</a></td>
				</tr>
				}
				{this.props.transaction.attachment.hasOwnProperty("shufflingStateHash") &&
				<tr>
					<td>Shuffling State Hash:</td>
					<td>{this.props.transaction.attachment.shufflingStateHash}</td>
				</tr>
				}
				{this.props.transaction.attachment.hasOwnProperty("data") &&
				<tr>
					<td>Data:</td>
					<td>{this.props.transaction.attachment.data.map(item => <div>{item}</div>)}</td>
				</tr>
				}
				{this.props.transaction.attachment.hasOwnProperty("hash") &&
				<tr>
					<td>Hash:</td>
					<td>{this.props.transaction.attachment.hash}</td>
				</tr>
				}
			</React.Fragment>
		);
	}
}

const mapDispatchToProps = {
	getShufflingAction,
	setBodyModalParamsAction,
	getTransactionAction,
};

export default connect(null, mapDispatchToProps)(ShufflingProcessing);