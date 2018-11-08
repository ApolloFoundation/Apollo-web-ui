import React, {Component} from "react";


export default class ShufflingRegistarion extends Component {
    render() {
        return(
            <React.Fragment>
	            {this.props.transaction.attachment.hasOwnProperty("shufflingFullHash") &&
	            <tr>
		            <td>Shuffling Full Hash:</td>
		            <td>{this.props.transaction.attachment.shufflingFullHash}</td>
	            </tr>
	            }
            </React.Fragment>
        );
    }
}