import React, {Component} from "react";


export default class ArbitraryMessage extends Component {
    render() {
        return(
            <React.Fragment>
	            {this.props.transaction.attachment.hasOwnProperty("message") &&
	            <tr>
		            <td>Public Message:</td>
		            <td>{this.props.transaction.attachment.message}</td>
	            </tr>
	            }
	            {this.props.transaction.senderRS &&
	            <tr>
		            <td>From:</td>
		            <td>{this.props.transaction.senderRS}</td>
	            </tr>
	            }
	            {this.props.transaction.recipientRS &&
	            <tr>
		            <td>To:</td>
		            <td>{this.props.transaction.recipientRS}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("isCompressed") &&
	            <tr>
		            <td>Compressed:</td>
		            <td>{this.props.transaction.attachment.isCompressed}</td>
	            </tr>
	            }
            </React.Fragment>
        );
    }
}