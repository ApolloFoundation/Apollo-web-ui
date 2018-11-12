import React, {Component} from "react";
import {connect} from "react-redux";
import {getAssetAction} from "../../../../actions/assets";
import {setBodyModalParamsAction} from "../../../../modules/modals";


class AssetIssuance extends Component {
	componentDidMount = () => {
		this.getCurrency();
	};

	state = {};

	getCurrency = async () => {
		const asset = await this.props.getAssetAction({asset: this.props.transaction.attachment.asset});

		if (asset) {
			this.setState({
				...this.state,
				asset
			});
		}
	};

	render() {
		return (
			<React.Fragment>
				{this.props.transaction.attachment.hasOwnProperty("name") &&
				<tr>
					<td>Name:</td>
					<td>{this.props.transaction.attachment.name}</td>
				</tr>
				}
				{this.props.transaction.attachment.hasOwnProperty("decimals") &&
				<tr>
					<td>Decimals:</td>
					<td>{this.props.transaction.attachment.decimals}</td>
				</tr>
				}
				{this.props.transaction.attachment.hasOwnProperty("description") &&
				<tr>
					<td>Description:</td>
					<td>{this.props.transaction.attachment.description}</td>
				</tr>
				}

				{this.state.asset &&
				<tr>
					<td>Initial Quantity:</td>
					<td>{this.state.asset && this.state.asset.initialQuantityATU / 100000000}</td>
				</tr>
				}
				{this.props.transaction.attachment.hasOwnProperty("quantityATU") &&
				<tr>
					<td>Quantity:</td>
					<td>{this.props.transaction.attachment.quantityATU / 100000000}</td>
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
	constants: state.account.constants,
});

const mapDispatchToProps = dispatch => ({
	getAssetAction: (reqParams) => dispatch(getAssetAction(reqParams)),
	setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});


export default connect(mapStateToProps, mapDispatchToProps)(AssetIssuance)