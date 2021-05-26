/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { connect } from "react-redux";
import { setBodyModalParamsAction } from "../../../../modules/modals";

import { NotificationManager } from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";

import ModalBody from "../../../components/modals/modal-body";
import DeleteAliasForm from "./form";

class DeleteAlias extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
      advancedState: false,

      // submitting
      passphraseStatus: false,
      recipientStatus: false,
      amountStatus: false,
      feeStatus: false,
    };
  }

  handleFormSubmit = async (values) => {
    values = {
      ...values,
      priceATM: 0,
      alias: this.props.modalData,
    };

    this.props.processForm(
      values,
      "deleteAlias",
      "Alias has been deleted!",
      () => {
        this.props.setBodyModalParamsAction(null, {});
        NotificationManager.success("Alias has been deleted!", null, 5000);
      }
    );
  };

  render() {
    return (
      <ModalBody
        loadForm={this.loadForm}
        modalTitle={"Delete Alias"}
        isAdvanced={true}
        isFee
        closeModal={this.props.closeModal}
        handleFormSubmit={(values) => this.handleFormSubmit(values)}
        submitButtonName={"Delete Alias"}
      >
        <DeleteAliasForm />
      </ModalBody>
    );
  }
}

const mapStateToProps = (state) => ({
  modalData: state.modals.modalData,
});

const mapDispatchToProps = (dispatch) => ({
  submitForm: (data, requestType) =>
    dispatch(submitForm.submitForm(data, requestType)),
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAlias);
