import React, {Component} from "react";
import {connect} from "react-redux";
import {getAssetAction} from "actions/assets";
import {setBodyModalParamsAction} from "modules/modals";
import {getTransactionAction} from "actions/transactions";
import { getConstantsSelector } from "selectors";

class AssetDelete extends Component {
	componentDidMount = () => {
		this.getCurrency();
	};

	state = {};

	getCurrency = async () => {
		const asset = await this.props.getAssetAction({asset: this.props.transaction.attachment.asset});

		if (asset) {
			this.setState({
				asset
			});
		}
	};

	getTransaction = async (data) => {
		const reqParams = {
			transaction: data,
			account: this.props.account
		};

		const transaction = await this.props.getTransactionAction(reqParams);

		if (transaction) {
			this.setState({transactionAsset: transaction});
		}

	};

    render() {
        return(
            <React.Fragment>
	            {this.props.transaction.attachment.hasOwnProperty("asset") &&
	            <tr>
		            <td>Asset:</td>
		            <td className="blue-link-text"><a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_TRANSACTION', this.state.transactionAsset)}>{this.props.transaction.attachment.asset}</a></td>
	            </tr>
	            }
	            {this.state.asset &&
	            <tr>
		            <td>Asset Name:</td>
		            <td>{this.state.asset && this.state.asset.name}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("quantityQNT") &&
	            <tr>
		            <td>Quantity:</td>
		            <td>{this.props.transaction.attachment.quantityQNT / this.props.decimals}</td>
	            </tr>
	            }
	            {this.props.transaction.senderRS &&
	            <tr>
		            <td>Sender:</td>
		            <td className="blue-link-text"><a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', this.props.transaction.sender)}>{this.props.transaction.senderRS}</a></td>
	            </tr>
	            }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
	constants: getConstantsSelector(state),
});

const mapDispatchToProps ={
	getAssetAction,
	setBodyModalParamsAction,
	getTransactionAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssetDelete)
