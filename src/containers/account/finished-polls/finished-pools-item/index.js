/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { useDispatch } from 'react-redux'
import {Link} from 'react-router-dom';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import { useFormatTimestamp } from '../../../../hooks/useFormatTimestamp';

const FinishedpollsItem = props => {
    const dispatch = useDispatch();
    const handleTime = useFormatTimestamp();

    const handleInforansactionModal = () => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', props.poll));

    const handleAccountInfoModal = () => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', props.account));

    const handlePollResultModal = () => dispatch(setBodyModalParamsAction('POLL_RESULTS', props.poll));

    return (
        <tr>
            <td>
                <span className="blue-link-text" onClick={handleInforansactionModal}>{props.name}</span>
            </td>
            <td>
                { (props.description.length > 100) ? props.description.slice(0, 100) + '...' : props.description}
            </td>
            <td>
                <span className="blue-link-text" onClick={handleAccountInfoModal}>
                    {props.accountRS}
                </span>
            </td>
            <td>{handleTime(props.timestamp)}</td>
            <td className="align-right">
                <div className="btn-box inline">
                    <button
                        type='button'
                        onClick={handlePollResultModal}
                        className="btn btn-default"
                    >
                        Results
                    </button>
                    <Link to={"/followed-polls/" + props.poll} className="btn btn-default">View</Link>
                </div>
            </td>
        </tr>
    );
}

export default FinishedpollsItem;
