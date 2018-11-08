import React, {Component} from "react";


export default class AccountPropertyDelete extends Component {
    render() {
        return(
            <React.Fragment>
	            {this.props.transaction.attachment.hasOwnProperty("property") &&
	            <tr>
		            <td>Property:</td>
		            <td>{this.props.transaction.attachment.property}</td>
	            </tr>
	            }
            </React.Fragment>
        );
    }
}