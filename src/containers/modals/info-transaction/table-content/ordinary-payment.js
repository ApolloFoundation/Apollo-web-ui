import React, {Component} from "react";
import { bigIntDivision, bigIntFormat, bigIntFormatLength } from "helpers/util/bigNumberWrappers";

export default class OrdinaryPayment extends Component {
    render() {
        return(
            <React.Fragment>
	            {this.props.transaction.amountATM &&
	            <tr>
		            <td>Amount:</td>
		            <td>{bigIntFormatLength(bigIntDivision(this.props.transaction.amountATM, this.props.decimals))}</td>
	            </tr>
	            }
	            {this.props.transaction.feeATM &&
	            <tr>
		            <td>Fee:</td>
		            <td>{bigIntFormat(bigIntDivision(this.props.transaction.feeATM, this.props.decimals))}</td>
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
	            {this.props.transaction.fullHash &&
	            <tr>
		            <td>Hash:</td>
		            <td>{this.props.transaction.fullHash}</td>
	            </tr>
	            }
            </React.Fragment>
        );
    }
}
