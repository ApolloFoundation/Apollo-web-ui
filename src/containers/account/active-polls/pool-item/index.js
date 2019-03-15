/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {Link} from "react-router-dom";
import {formatTimestamp} from "../../../../helpers/util/time";

import {getTransactionAction} from '../../../../actions/transactions/';

const mapStateToPreops = state => ({

});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    getTransaction: (transaction) => dispatch(getTransactionAction(transaction)),
});


const PoolItem  = props => (
    <tr key={uuid()}>
        <td  key={uuid()} className="blue-link-text">
            <a onClick={() => props.setBodyModalParamsAction('INFO_TRANSACTION', props.poll)}>{props.name}</a>
        </td>
        <td key={uuid()} className={""}> { (props.description.length > 100) ? props.description.slice(0, 100) + '...' : props.description} </td>
        <td key={uuid()} className="blue-link-text">
            <a onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.account)}> {props.accountRS} </a>
        </td>
        <td key={uuid()} className={""}>
            {props.formatTimestamp(props.timestamp)}
        </td>
        <td key={uuid()} className={""}>
            {props.finishHeight}
        </td>
        <td key={uuid()} className={"align-right"}>
            <div className="btn-box inline">
            
            
                <a  onClick={() =>  props.setBodyModalParamsAction('POLL_RESULTS', props.poll)} className="btn primary blue">Results</a>
                <Link to={"/followed-polls/" + props.poll } className="btn primary blue">View</Link>
            </div>
        </td>
    </tr>
);

export default connect(mapStateToPreops, mapDispatchToProps)(PoolItem)