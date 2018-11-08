import React, {Component} from "react";


export default class AliasDelete extends Component {
    render() {
        return(
            <React.Fragment>
	            {this.props.transaction.attachment.hasOwnProperty("alias") &&
	            <tr>
		            <td>Alias:</td>
		            <td>{this.props.transaction.attachment.alias}</td>
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