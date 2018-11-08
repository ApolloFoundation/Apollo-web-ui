import React, {Component} from "react";


export default class VoteCasting extends Component {
    render() {
        return(
            <React.Fragment>
	            {this.props.transaction.attachment.hasOwnProperty("poll") &&
	            <tr>
		            <td>Poll:</td>
		            <td>{this.props.transaction.attachment.poll}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("vote") &&
	            <tr>
		            <td>Vote:</td>
		            <td>{this.props.transaction.attachment.vote.map((item) => <spsn>{item}, </spsn>)}</td>
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