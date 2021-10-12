/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { connect } from "react-redux";
import Button from "../../../components/button";

const mapStateToProps = (state) => ({
  isLocalhost: state.account.isLocalhost,
});

const Peer = (props) => (
  <tr>
    <td>
      <Button
        color="blue-link"
        onClick={() => props.onTransactionSelected(props.address)}
        name={props.address}
        endIcon={
          props.state === 1 ? (
            <i className="zmdi zmdi-check-circle" />
          ) : props.state === 2 ? (
            <i className="zmdi zmdi-close-circle" />
          ) : null
        }
      />
    </td>
    <td className="align-right">{props.weight}</td>
    <td className="align-right">
      {Math.round(props.downloadedVolume / 1000)} KB
    </td>
    <td className="align-right">
      {Math.round(props.uploadedVolume / 1000)} KB
    </td>
    <td className="align-right">
      {props.application} {props.version}
    </td>
    <td className="blue-link-text">{props.platform}</td>
    <td className="align-right">
      {props.services &&
        props.services.map((el, index) => {
          if (index !== 0) {
            return ", " + el;
          } else {
            return el;
          }
        })}
    </td>
    <td className="align-right">
      {props.isLocalhost && (
        <>
          <button
            type={"button"}
            className="btn btn-default mt-0"
            onClick={() => props.onConnectClick(props.address)}
          >
            Connect
          </button>
          <button
            type={"button"}
            onClick={() => props.onBlacklistClick(props.address)}
            className="btn btn-default mt-0 ml-3"
          >
            Blacklist
          </button>
        </>
      )}
    </td>
  </tr>
);

export default connect(mapStateToProps)(Peer);
