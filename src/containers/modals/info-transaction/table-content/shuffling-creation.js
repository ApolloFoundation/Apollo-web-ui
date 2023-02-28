import React, {Component} from "react";
import {getShufflingAction} from "actions/shuffling";
import {connect} from "react-redux";
import {setBodyModalParamsAction} from "modules/modals";
import { getConstantsSelector } from "selectors";
import { bigIntDivision, bigIntFormat } from "helpers/util/bigNumberWrappers";

function Stage (number) {
	if(number === "0"){
	    return 'Registration';
	}else if (number === "1") {
	    return 'Processing';
	}else if (number === "4") {
	    return 'Expired';
	}else if (number === "5") {
	    return 'Done';
	}
}

class ShufflingCreation extends Component {
	state = {
		shuffling: null
	};

	getShuffling = async () => {
		const shuffling = await this.props.getShufflingAction({
			shuffling: this.props.transaction.transaction
		});
		if (shuffling) {
			this.setState({
				shuffling
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
		            <td>{bigIntFormat(bigIntDivision(this.props.transaction.attachment.amount, this.props.decimals))} {this.props.ticker}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("holding") &&
	            <tr>
		            <td>Stage:</td>
		            <td>{Stage(this.props.transaction.attachment.holding)}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("participantCount") &&
	            <tr>
		            <td>Count:</td>
		            <td>{this.state.shuffling && this.state.shuffling.registrantCount}/{this.props.transaction.attachment.participantCount}</td>
	            </tr>
	            }
	            {
	            <tr>
		            <td>Blocks Remaining:</td>
		            <td>{this.state.shufflings && this.state.shufflings.blocksRemaining ? this.state.shufflings.blocksRemaining : 0}</td>
	            </tr>
	            }
	            {this.props.transaction.senderRS &&
	            <tr>
		            <td>Issuer:</td>
		            <td className={"blue-link-text"}>
			            <a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', this.props.transaction.sender)}>
				            {this.props.transaction.senderRS}
			            </a>
		            </td>
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
	constants: getConstantsSelector(state),
});

const mapDispatchToProps = {
	setBodyModalParamsAction,
	getShufflingAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShufflingCreation);
