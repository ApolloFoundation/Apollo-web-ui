import React, {Component} from "react";


export default class ShufflingVerification extends Component {
    render() {
        return(
            <React.Fragment>
	            {this.props.transaction.attachment.hasOwnProperty("shuffling") &&
	            <tr>
		            <td>Shuffling:</td>
		            <td>{this.props.transaction.attachment.shuffling}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("shufflingStateHash") &&
	            <tr>
		            <td>Shuffling Full Hash:</td>
		            <td>{this.props.transaction.attachment.shufflingStateHash}</td>
	            </tr>
	            }
            </React.Fragment>
        );
    }
}