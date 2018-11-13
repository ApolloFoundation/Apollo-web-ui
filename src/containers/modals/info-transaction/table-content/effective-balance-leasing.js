import React, {Component} from "react";


export default class EffectiveBalanceLeasing extends Component {
    render() {
        return(
            <React.Fragment>
	            {this.props.transaction.attachment.hasOwnProperty("period") &&
	            <tr>
		            <td>Period:</td>
		            <td>{this.props.transaction.attachment.period}</td>
	            </tr>
	            }
	            {this.props.transaction.recipientRS &&
	            <tr>
		            <td>Lessee:</td>
		            <td>{this.props.transaction.recipientRS}</td>
	            </tr>
	            }
            </React.Fragment>
        );
    }
}