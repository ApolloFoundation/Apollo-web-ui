import React, { Component } from "react";
import { getShufflingAction } from "../../../../actions/shuffling";
import { connect } from "react-redux";
import { setBodyModalParamsAction } from "../../../../modules/modals";

function Stage(number) {
  if (number === "0") {
    return "Registration";
  } else if (number === "1") {
    return "Processing";
  } else if (number === "4") {
    return "Expired";
  } else if (number === "5") {
    return "Done";
  }
}

class ShufflingCreation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shuffling: null,
    };
  }

  getShuffling = async () => {
    const shuffling = await this.props.getShufflingAction({
      shuffling: this.props.transaction.transaction,
    });
    if (shuffling) {
      this.setState({
        shuffling,
      });
    }
  };

  componentDidMount = () => {
    this.getShuffling();
  };

  render() {
    return (
      <React.Fragment>
        {this.props.transaction.attachment.hasOwnProperty(
          "registrationPeriod"
        ) && (
          <tr>
            <td>Period:</td>
            <td>{this.props.transaction.attachment.registrationPeriod}</td>
          </tr>
        )}
        {this.props.transaction.attachment.hasOwnProperty("holdingType") && (
          <tr>
            <td>Holding Type:</td>
            <td>{this.props.transaction.attachment.holdingType}</td>
          </tr>
        )}
        {this.props.transaction.attachment.hasOwnProperty("amount") && (
          <tr>
            <td>Amount:</td>
            <td>
              {this.props.transaction.attachment.amount / this.props.decimals}{" "}
              {this.props.ticker}
            </td>
          </tr>
        )}
        {this.props.transaction.attachment.hasOwnProperty("holding") && (
          <tr>
            <td>Stage:</td>
            <td>{Stage(this.props.transaction.attachment.holding)}</td>
          </tr>
        )}
        {this.props.transaction.attachment.hasOwnProperty(
          "participantCount"
        ) && (
          <tr>
            <td>Count:</td>
            <td>
              {this.state.shuffling && this.state.shuffling.registrantCount}/
              {this.props.transaction.attachment.participantCount}
            </td>
          </tr>
        )}
        {
          <tr>
            <td>Blocks Remaining:</td>
            <td>
              {this.state.shufflings && this.state.shufflings.blocksRemaining
                ? this.state.shufflings.blocksRemaining
                : 0}
            </td>
          </tr>
        }
        {this.props.transaction.senderRS && (
          <tr>
            <td>Issuer:</td>
            <td>
              <button
                type="button"
                className="btn btn-blue-link"
                onClick={this.props.setBodyModalParamsAction.bind(
                  this,
                  "INFO_ACCOUNT",
                  this.props.transaction.sender
                )}
              >
                {this.props.transaction.senderRS}
              </button>
            </td>
          </tr>
        )}
        {this.props.transaction.recipientRS && (
          <tr>
            <td>Assignee:</td>
            <td>{this.props.transaction.recipientRS}</td>
          </tr>
        )}
        {this.props.transaction.fullHash && (
          <tr>
            <td>Shuffling State Hash:</td>
            <td>{this.props.transaction.fullHash}</td>
          </tr>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  constants: state.account.constants,
});

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  getShufflingAction: (reqParams) => dispatch(getShufflingAction(reqParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShufflingCreation);
