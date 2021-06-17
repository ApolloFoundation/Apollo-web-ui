import React from "react";
import { connect } from "react-redux";
import TextualInputComponent from "../../../components/form-components/textual-input";

import { getAliasAction } from "../../../../actions/aliases";

class DeleteAliasForm extends React.Component {
  state = {};
  componentDidMount = () => {
    this.getAlias();
  };

  getAlias = async () => {
    const alias = await this.props.getAliasAction({
      alias: this.props.modalData,
    });

    if (alias) {
      this.setState({
        alias,
      });
    }
  };

  render() {
    return (
      <>
        <TextualInputComponent
          label={"Alias"}
          text={this.state.alias ? this.state.alias.aliasName : ""}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  modalData: state.modals.modalData,
});

const mapDispatchToProps = (dispatch) => ({
  getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAliasForm);
