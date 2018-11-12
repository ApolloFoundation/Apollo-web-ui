import React, {Component} from "react";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from "react-redux";


class ShufflingRecipients extends Component {
    render() {

        return(
            <React.Fragment>
	            {this.props.transaction.attachment.hasOwnProperty("shufflingStateHash") &&
	            <tr>
		            <td>Shuffling State Hash:</td>
		            <td>{this.props.transaction.attachment.shufflingStateHash}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("shuffling") &&
	            <tr>
		            <td>Shuffling:</td>
		            <td>{this.props.transaction.attachment.shuffling}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("recipientPublicKeys") &&
	            <tr>
		            <td>Recipients:</td>
		            <td>{this.props.transaction.attachment.recipientPublicKeys.map(item => <div className={"table-item"}>{item}</div>)}</td>
	            </tr>
	            }

            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
	setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShufflingRecipients);