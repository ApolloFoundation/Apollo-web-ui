import React, {Component} from "react";


export default class ShufflingProcessing extends Component {
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
		            <td>Shuffling State Hash:</td>
		            <td>{this.props.transaction.attachment.shufflingStateHash}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("data") &&
	            <tr>
		            <td>Data:</td>
		            <td>{this.props.transaction.attachment.data.map(item => <div>{item}</div>)}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("hash") &&
	            <tr>
		            <td>Hash:</td>
		            <td>{this.props.transaction.attachment.hash}</td>
	            </tr>
	            }
            </React.Fragment>
        );
    }
}