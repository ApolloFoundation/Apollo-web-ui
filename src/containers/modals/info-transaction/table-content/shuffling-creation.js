import React, {Component} from "react";
import {getShufflingAction} from "../../../../actions/shuffling";
import {connect} from "react-redux";


class ShufflingCreation extends Component {
	constructor(props) {
		super(props);

		this.state = {
			shuffling: null
		};
	}

	getShuffling = async () => {
		const shuffling2 = await this.props.getShufflingAction({
			shuffling2: this.props.modalData
		});
		if (shuffling2) {
			this.setState({
				shuffling: shuffling2
			});
		}
	};

	componentDidMount = () => {
		this.getShuffling();
	};

    render() {
        return(
            <React.Fragment>
	            {this.props.transaction.attachment.hasOwnProperty("registrationPeriod") &&
	            <tr>
		            <td>Period:</td>
		            <td>{this.props.transaction.attachment.registrationPeriod}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("holdingType") &&
	            <tr>
		            <td>Holding Type:</td>
		            <td>{this.props.transaction.attachment.holdingType}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("amount") &&
	            <tr>
		            <td>Amount:</td>
		            <td>{this.props.transaction.attachment.amount / 100000000} Apollo</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("participantCount") &&
	            <tr>
		            <td>Count:</td>
		            <td>1/{this.props.transaction.attachment.participantCount}</td>
	            </tr>
	            }
	            {
	            <tr>
		            <td>Blocks Remaining:</td>
		            <td>{this.state.shuffling}</td>
	            </tr>
	            }
	            {this.props.transaction.senderRS &&
	            <tr>
		            <td>Issuer:</td>
		            <td>{this.props.transaction.senderRS}</td>
	            </tr>
	            }
	            {this.props.transaction.recipientRS &&
	            <tr>
		            <td>Assignee:</td>
		            <td>{this.props.transaction.recipientRS}</td>
	            </tr>
	            }
	            {this.props.transaction.fullHash &&
	            <tr>
		            <td>Shuffling State Hash:</td>
		            <td>{this.props.transaction.fullHash}</td>
	            </tr>
	            }
            </React.Fragment>
        );
    }
}


const mapStateToProps = state => ({
	constants: state.account.constants,
});

const mapDispatchToProps = dispatch => ({
	getShufflingAction: (reqParams) => dispatch(getShufflingAction(reqParams)),
});


export default connect(mapStateToProps, mapDispatchToProps)(ShufflingCreation);