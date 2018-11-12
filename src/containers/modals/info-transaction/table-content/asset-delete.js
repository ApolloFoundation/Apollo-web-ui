import React, {Component} from "react";


export default class AssetDelete extends Component {
    render() {
        return(
            <React.Fragment>
	            {this.props.transaction.attachment.hasOwnProperty("asset") &&
	            <tr>
		            <td>Asset:</td>
		            <td>{this.props.transaction.attachment.asset}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("shufflingStateHash") &&
	            <tr>
		            <td>Asset Name:</td>
		            <td>{this.props.transaction.attachment.shufflingStateHash}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("quantityQNT") &&
	            <tr>
		            <td>Quantity:</td>
		            <td>{this.props.transaction.attachment.quantityQNT}</td>
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