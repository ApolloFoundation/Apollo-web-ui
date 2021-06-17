/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { connect } from "react-redux";
import {
  setAlert,
  setBodyModalParamsAction,
  setModalData,
  saveSendModalState,
  openPrevModal,
} from "../../../../modules/modals";

import { NotificationManager } from "react-notifications";
import { getAliasAction } from "../../../../actions/aliases";
import submitForm from "../../../../helpers/forms/forms";

import ModalBody from "../../../components/modals/modal-body";
import TransferCurrencyForm from "./form";

class TransferAlias extends React.Component {
  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);

    this.state = {
      activeTab: 0,
      advancedState: false,

      // submitting
      passphraseStatus: false,
      recipientStatus: false,
      amountStatus: false,
      feeStatus: false,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleAdvancedState = this.handleAdvancedState.bind(this);
  }

  componentDidMount = () => {
    this.getAlias();
  };

  async handleFormSubmit(values) {
    values = {
      ...values,
      priceATM: 0,
      aliasName: this.state.alias.aliasName,
    };

    this.setState({
      isPending: true,
    });

    const res = await this.props.submitForm(values, "sellAlias");
    if (res && res.errorCode) {
      this.setState({
        isPending: false,
      });
      NotificationManager.error(res.errorDescription, "Error", 5000);
    } else {
      this.props.setBodyModalParamsAction(null, {});

      NotificationManager.success("Alias has been transferred!", null, 5000);
    }
  }

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

  handleTabChange(tab) {
    this.setState({
      ...this.props,
      activeTab: tab,
    });
  }

  handleAdvancedState() {
    if (this.state.advancedState) {
      this.setState({
        ...this.props,
        advancedState: false,
      });
    } else {
      this.setState({
        ...this.props,
        advancedState: true,
      });
    }
  }

  handleChange = (value) => {
    this.setState({
      inputType: value,
    });
  };

  render() {
    return (
      <ModalBody
        loadForm={this.loadForm}
        modalTitle={"Transfer Alias"}
        isAdvanced={true}
        isFee
        closeModal={this.props.closeModal}
        handleFormSubmit={(values) => this.handleFormSubmit(values)}
        submitButtonName={"Transfer Alias"}
      >
        <TransferCurrencyForm />
      </ModalBody>
    );
  }
}

const mapStateToProps = (state) => ({
  modalData: state.modals.modalData,
  modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = (dispatch) => ({
  setAlert: (status, message) => dispatch(setAlert(status, message)),
  setModalData: (data) => dispatch(setModalData(data)),
  submitForm: (data, requestType) =>
    dispatch(submitForm.submitForm(data, requestType)),
  getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
  openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferAlias);
