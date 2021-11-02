import React, { Component } from "react";
import { connect } from "react-redux";
import { getAssetAction } from "../../../../actions/assets";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { getTransactionAction } from "../../../../actions/transactions";
import Button from "../../../components/button";

class AssetDelete extends Component {
  componentDidMount = () => {
    this.getCurrency();
  };

  state = {};

  getCurrency = async () => {
    const asset = await this.props.getAssetAction({
      asset: this.props.transaction.attachment.asset,
    });

    if (asset) {
      this.setState({
        asset,
      });
    }
  };

  getTransaction = async (data) => {
    const reqParams = {
      transaction: data,
      account: this.props.account,
    };

    const transaction = await this.props.getTransactionAction(reqParams);

    if (transaction) {
      this.setState({ transactionAsset: transaction });
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.props.transaction.attachment.hasOwnProperty("asset") && (
          <tr>
            <td>Asset:</td>
            <td>
              <Button
                color="blue-link"
                onClick={this.props.setBodyModalParamsAction.bind(
                  this,
                  "INFO_TRANSACTION",
                  this.state.transactionAsset
                )}
                name={this.props.transaction.attachment.asset}
              />
            </td>
          </tr>
        )}
        {this.state.asset && (
          <tr>
            <td>Asset Name:</td>
            <td>{this.state.asset && this.state.asset.name}</td>
          </tr>
        )}
        {this.props.transaction.attachment.hasOwnProperty("quantityQNT") && (
          <tr>
            <td>Quantity:</td>
            <td>
              {this.props.transaction.attachment.quantityQNT /
                this.props.decimals}
            </td>
          </tr>
        )}
        {this.props.transaction.senderRS && (
          <tr>
            <td>Sender:</td>
            <td>
              <Button
                color="blue-link"
                onClick={this.props.setBodyModalParamsAction.bind(
                  this,
                  "INFO_ACCOUNT",
                  this.props.transaction.sender
                )}
                name={this.props.transaction.senderRS}
              />
            </td>
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
  getAssetAction: (reqParams) => dispatch(getAssetAction(reqParams)),
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  getTransactionAction: (requestParams) =>
    dispatch(getTransactionAction(requestParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssetDelete);
