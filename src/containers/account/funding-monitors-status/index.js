/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import classNames from "classnames";
import { getAccountPropertiesAction } from "../../../actions/account/index";
import { setBodyModalParamsAction } from "../../../modules/modals";
import SiteHeader from "../../components/site-header";
import ContentHendler from "../../components/content-hendler";
import FundingMonitorItem from "./funding-monitor-status-item";
import Button from "../../components/button";

const mapStateToProps = (state) => ({
  account: state.account.account,
});

const mapDisatchToProps = (dispatch) => ({
  getAccountPropertiesAction: (requsetParams) =>
    dispatch(getAccountPropertiesAction(requsetParams)),
  setBodyModalParamsAction: (type, data) =>
    dispatch(setBodyModalParamsAction(type, data)),
});

class FundingMonitorsStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    properties: null,
    firstIndex: 0,
    lastIndex: 15,
    page: 1,
    recipientRS: null,
    setterRS: null,
    incoming: true,
  };

  componentDidMount() {
    this.getAccountProperties(this.props);
  }

  componentWillReceiveProps(newState) {
    this.getAccountProperties(newState);
  }

  getAccountProperties = async (newState) => {
    if (!newState) newState = this.props;

    const properties = await this.props.getAccountPropertiesAction({
      setter: newState.match.params.account,
      property: newState.match.params.property,
      firstIndex: this.state.firstIndex,
      lastIndex: this.state.lastIndex,
    });

    if (properties) {
      this.setState({
        properties: properties.properties,
        recipientRS: properties.recipientRS,
        incoming: true,
      });
    }
  };

  setProperty = (el) =>
    this.props.setBodyModalParamsAction("SET_ACCOUNT_PROPERTY", el);

  deleteProperty = (el) => {
    const data = el;
    if (this.state.incoming) data.recipientRS = this.state.recipientRS;
    else data.setterRS = this.state.setterRS;
    this.props.setBodyModalParamsAction("DELETE_ACCOUNT_PROPERTY", data);
  };

  render() {
    return (
      <div className="page-content">
        <SiteHeader pageTitle={"Funding Monitor Status"}>
          <Link
            to={"/funding-monitors"}
            className={classNames({
              btn: true,
              primary: true,
              disabled: this.state.isPrivate,
            })}
          >
            Funding monitors
          </Link>
          <Button
            className="ml-1"
            disabled={this.state.isPrivate}
            name="Add Monitored Account"
            onClick={() => {
              this.props.setBodyModalParamsAction("ADD_MONITORED_ACCOUNT", {
                property: this.props.match.params.property,
              });
            }}
          />
        </SiteHeader>
        <div className="page-body container-fluid">
          <div className="my-transactions">
            <div className="transactions-filters pt-0">
              <div className="monitors-table">
                <tr>
                  <td>Account: </td>
                  <td>
                    <Button
                      name={this.props.match.params.account}
                      color="blue-link"
                      onClick={() =>
                        this.props.setBodyModalParamsAction(
                          "INFO_ACCOUNT",
                          this.props.match.params.account
                        )
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>Property: </td>
                  <td>{this.props.match.params.property}</td>
                </tr>
              </div>
            </div>
            <ContentHendler
              items={this.state.properties}
              emptyMessage={"No properties found."}
            >
              <div className="transaction-table">
                <div className="transaction-table-body">
                  <table>
                    <thead>
                      <tr>
                        <td>{this.state.incoming ? "Setter" : "Recipient"}</td>
                        <td>Property</td>
                        <td>Value</td>
                        <td className="align-right">Actions</td>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.properties &&
                        this.state.properties.length &&
                        this.state.properties.map((el, index) => {
                          return <FundingMonitorItem key={index} {...el} />;
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </ContentHendler>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDisatchToProps
)(FundingMonitorsStatus);
