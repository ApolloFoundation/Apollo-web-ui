/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {formatTimestamp} from "helpers/util/time";

const Peer = (props) => (
    <tr>
        <td>
            {props.name}
        </td>
        <td>
            {props.decription}
        </td>
        <td>
            {props.stateOfTask === "Finished" ? 100.00 : props.percentComplete.toFixed(2)}%
        </td>
        <td>
            {props.stateOfTask}
        </td>
        <td>
            {props.started ? props.formatTimestamp(props.started, false, true) : '-'}
        </td>
        <td>
            {props.finished ? props.formatTimestamp(props.finished, false, true) : '-'}
        </td>
    </tr>
);

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});
export default connect(null, mapDispatchToProps)(Peer);
