/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux'
import uuid from "uuid";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {Link} from 'react-router-dom';

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});


const FinishedpollsItem = props => (
    <tr key={uuid()}>
        <td  key={uuid()} className="blue-link-text">
            <a onClick={() => props.getTransaction(props.poll)}>{props.name}</a>
        </td>
        <td key={uuid()} className={""}> { (props.description.length > 100) ? props.description.slice(0, 100) + '...' : props.description} </td>
        <td key={uuid()} className="blue-link-text">
            <a onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.account)}> {props.accountRS} </a>
        </td>
        <td key={uuid()} className={""}>
            {props.timestamp}
        </td>
        <td key={uuid()} className={""}>
            {props.finishHeight}
        </td>
        <td key={uuid()} className={"align-right"}>
            <div className="btn-box inline">
                <Link to={"/followed-polls/" + props.poll} className="btn primary blue">View</Link>
            </div>
        </td>
    </tr>
);

export default connect(null, mapDispatchToProps)(FinishedpollsItem);
