import React, { Component } from "react";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { connect } from "react-redux";
import { getShufflingAction } from "../../../../actions/shuffling";
import { getTransactionAction } from "../../../../actions/transactions";
import Button from "../../../components/button";

class ShufflingVerification extends Component {
  componentDidMount = () => {
    this.getCurrency();
    if (this.props.transaction.attachment.shuffling) {
      this.getTransaction(this.props.transaction.attachment.shuffling);
    }
  };

  state = {};

  getTransaction = async (data) => {
    const reqParams = {
      transaction: data,
      account: this.props.account,
    };

    const transaction = await this.props.getTransactionAction(reqParams);

    if (transaction) {
      this.setState({ transactionShuffling: transaction });
    }
  };

  getCurrency = async () => {
    const shuffling = await this.props.getShufflingAction({
      shuffling: this.props.transaction.attachment.shuffling,
    });
    if (shuffling) {
      this.setState({
        shuffling,
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.props.transaction.attachment.hasOwnProperty("shuffling") && (
          <tr>
            <td>Shuffling:</td>
            <td className="blue-link-text">
              <Button
                color="blue-link"
                onClick={this.props.setBodyModalParamsAction.bind(
                  this,
                  "INFO_TRANSACTION",
                  this.state.transactionShuffling
                )}
                name={this.props.transaction.attachment.shuffling}
              />
            </td>
          </tr>
        )}
        {this.props.transaction.attachment.hasOwnProperty(
          "shufflingStateHash"
        ) && (
          <tr>
            <td>Shuffling Full Hash:</td>
            <td>{this.props.transaction.attachment.shufflingStateHash}</td>
          </tr>
        )}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getShufflingAction: (reqParams) => dispatch(getShufflingAction(reqParams)),
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  getTransactionAction: (requestParams) =>
    dispatch(getTransactionAction(requestParams)),
});

export default connect(null, mapDispatchToProps)(ShufflingVerification);
