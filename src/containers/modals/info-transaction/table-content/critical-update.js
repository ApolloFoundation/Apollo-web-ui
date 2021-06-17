import React, { Component } from "react";
import { connect } from "react-redux";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import Button from '../../../components/button';

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class CriticalUpdate extends Component {
  render() {
    return (
      <React.Fragment>
        {this.props.transaction && (
          <React.Fragment>
            <tr>
              <td>Version:</td>
              <td>{this.props.transaction.attachment.version}</td>
            </tr>
            <tr>
              <td>Architecture:</td>
              <td>{this.props.transaction.attachment.architecture}</td>
            </tr>
            <tr>
              <td>Hash:</td>
              <td>{this.props.transaction.attachment.hash}</td>
            </tr>
            <tr>
              <td>Platform:</td>
              <td>{this.props.transaction.attachment.platform}</td>
            </tr>
            <tr>
              <td>Sender:</td>
              <td>
                <Button
                  color="blue-link"
                  onClick={this.props.setBodyModalParamsAction.bind(
                    this,
                    "INFO_ACCOUNT",
                    this.props.transaction.senderRS
                  )}
                  name={this.props.transaction.senderRS}
                />
              </td>
            </tr>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default connect(null, mapDispatchToProps)(CriticalUpdate);
