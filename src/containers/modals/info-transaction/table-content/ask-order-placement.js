import React, {Component} from "react";
import {connect} from "react-redux";
import {getAssetAction} from "../../../../actions/assets";


class AskOrderPlacement extends Component {
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
        return(
            <React.Fragment>
	            {this.props.transaction.attachment.hasOwnProperty("asset") &&
	            <tr>
		            <td>Asset:</td>
		            <td>{this.props.transaction.attachment.asset}</td>
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
		            <td>{this.props.transaction.attachment.quantityQNT / 100000000}</td>
	            </tr>
	            }
	            {this.props.transaction.senderRS &&
	            <tr>
		            <td>Sender:</td>
		            <td>{this.props.transaction.senderRS}</td>
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
});


export default connect(mapStateToProps, mapDispatchToProps)(AskOrderPlacement)