/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux'
import { v4 as uuidv4 } from 'uuid';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {Link} from 'react-router-dom';
import {formatTimestamp} from "../../../../helpers/util/time";

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
});


const FinishedpollsItem = props => (
    <tr key={uuidv4()}>
        <td  key={uuidv4()} className="blue-link-text">
            <a onClick={() => props.setBodyModalParamsAction('INFO_TRANSACTION', props.poll)}>{props.name}</a>
        </td>
        <td key={uuidv4()} className={""}> { (props.description.length > 100) ? props.description.slice(0, 100) + '...' : props.description} </td>
        <td key={uuidv4()} className="blue-link-text">
            <a onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.account)}> {props.accountRS} </a>
        </td>
        <td key={uuidv4()} className={""}>
            {props.formatTimestamp(props.timestamp)}
        </td>
        <td key={uuidv4()} className={"align-right"}>
            <div className="btn-box inline">
                <button
                    type={'button'}
                    onClick={() =>  props.setBodyModalParamsAction('POLL_RESULTS', props.poll)}
                    className="btn btn-default"
                >
                    Results
                </button>
                <Link to={"/followed-polls/" + props.poll} className="btn btn-default">View</Link>
            </div>
        </td>
    </tr>
);

export default connect(null, mapDispatchToProps)(FinishedpollsItem);
