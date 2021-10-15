import React from "react";
import { connect } from "react-redux";

import classNames from "classnames";

import { NavLink, withRouter } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NotificationManager } from "react-notifications";
import { logOutAction } from "../../../../actions/login";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import Button from "../../../components/button";

class CurrentAccount extends React.Component {
  refContactsList = React.createRef();
  refContactsButton = React.createRef();
  state = {
    contacts: JSON.parse(localStorage.getItem("APLContacts")),
    isContacts: false,
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperContactsButtonRef = (node) => {
    this.refContactsButton = node;
  };

  setWrapperContactsRef = (node) => {
    this.refContactsList = node;
  };

  handleClickOutside = (event) => {
    if (
      this.state.isContacts &&
      this.refContactsList &&
      !this.refContactsList.contains(event.target) &&
      this.refContactsButton &&
      !this.refContactsButton.contains(event.target)
    ) {
      this.setState({
        isContacts: false,
      });
    }
  };

  handleContacts = () => {
    if (this.state.contacts && !!this.state.contacts.length) {
      this.setState({
        isContacts: !this.state.isContacts,
      });
    } else {
      NotificationManager.info("You have an empty contacts list.", null, 5000);
    }
  };

  handleSetAccountInfo = () => setBodyModalParamsAction("SET_ACCOUNT_INFO", {});

  onCopyAccount = () => {
    NotificationManager.success("The account has been copied to clipboard.");
  }

  render() {
    const {
      accountRS,
      account,
      publicKey,
      isActive,
      setBodyModalParamsAction,
      history,
      switchAccountAction,
      forgingStatus,
      closeMenu,
    } = this.props;

    return (
      <div
        className={classNames({
          "no-padding": true,
          "account-body-modal-window": true,
          "account-body-modal": true,
          active: isActive,
          "settings-menu": true,
          "settings-bar": true,
          stop: true,
        })}
      >
        <div className="form-group-app">
          <div className="form-title">
            <Button
              className="exit d-lg-none"
              color="transparent"
              name={<i className="zmdi zmdi-close" />}
              size="sm"
              onClick={closeMenu}
            />
            <p>Current account</p>
          </div>
          {!publicKey && (
            <div className="form-sub-title">
              Not verified profile
              <br />
              <CopyToClipboard text={accountRS} onCopy={this.onCopyAccount}>
                <Button
                  className="btn-transparent"
                  color="blue-link"
                  name={accountRS}
                />
              </CopyToClipboard>
            </div>
          )}
          {publicKey && (
            <div className="form-sub-title">
              Verified profile
              <br />
              <CopyToClipboard text={accountRS} onCopy={this.onCopyAccount}>
                <Button
                  className="btn-transparent"
                  color="blue-link"
                  name={accountRS}
                />
              </CopyToClipboard>
            </div>
          )}
          <div className="form-body">
            <div className="input-section">
              <div className="row position-relative">
                <div className="col-xc-12 col-md-6">
                  <Button
                    className="block"
                    color="green"
                    name="Set account info"
                    onClick={this.handleSetAccountInfo}
                  />
                </div>
                <div className="col-xc-12 col-md-6">
                  <Button
                    ref={this.setWrapperContactsButtonRef}
                    className="block"
                    name="Switch account"
                    onClick={this.handleContacts}
                  />
                </div>
                {this.state.contacts && (
                  <div
                    ref={this.setWrapperContactsRef}
                    className={classNames({
                      "mx-0": true,
                      "contacts-list": true,
                      active: this.state.isContacts,
                    })}
                  >
                    <ul>
                      {this.state.contacts &&
                        this.state.contacts.length &&
                        this.state.contacts.map((el, index) => {
                          return (
                            <li>
                              <Button
                                className="w-100"
                                name={el.name}
                                onClick={() =>
                                  switchAccountAction(el.accountRS, history)
                                }
                              />
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="input-section">
              <Button
                className="image-button px-0"
                color="transparent"
                onClick={() =>
                  setBodyModalParamsAction("INFO_ACCOUNT", account)
                }
                startIcon={<i className="zmdi zmdi-account" />}
                name="Details"
              />
              <NavLink
                activeClassName={"active"}
                to="/messenger"
                className="image-button"
              >
                <i className="zmdi zmdi-comments" />
                <label>Messages</label>
              </NavLink>
            </div>
            <div className="input-section">
              <NavLink
                activeClassName={"active"}
                to="/settings"
                className="image-button"
              >
                <i className="zmdi zmdi-settings" />
                <label>Account settings</label>
              </NavLink>
            </div>
            <div className="input-section">
              <Button
                className="image-button px-0"
                color="transparent"
                onClick={() => logOutAction("simpleLogOut", history)}
                startIcon={<i className="zmdi zmdi-power" />}
                name="Logout"
              />
              {forgingStatus && !forgingStatus.errorCode && (
                <Button
                  className="image-button px-0"
                  color="transparent"
                  onClick={() => logOutAction("logOutStopForging", history)}
                  startIcon={<i className="zmdi zmdi-pause-circle" />}
                  name="Logout and stop forging"
                />
              )}
              <Button
                className="image-button px-0"
                color="transparent"
                onClick={() => logOutAction("logoutClearUserData", history)}
                startIcon={<i className="zmdi zmdi-close-circle" />}
                name="Logout and clear user data"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.account.account,
  accountRS: state.account.accountRS,
  publicKey: state.account.publicKey,
  forgingStatus: state.account.forgingStatus,
});

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, values) =>
    dispatch(setBodyModalParamsAction(type, values)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CurrentAccount));
