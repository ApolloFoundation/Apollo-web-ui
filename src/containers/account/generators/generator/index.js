/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch} from 'react-redux';
import {setBodyModalParamsAction} from "modules/modals";
import {toEpochTime} from "helpers/util/time"
import { numberToLocaleString } from 'helpers/format';
import { useFormatTimestamp } from 'hooks/useFormatTimestamp';

const Generator = ({
    account, accountRS, effectiveBalanceAPL, hitTime, deadline, epochB, resTimestamps
}) => {
    const dispatch = useDispatch();
    const handleFormatTime = useFormatTimestamp();
    // const [remaining, setRemaining] = useState(0);

    // const initTimer = useCallback(() => {
    //     const result = deadline - (toEpochTime(undefined, epochB) - resTimestamps) + 20;
    //     setRemaining(result)
    // }, [setRemaining]);

    // useEffect(() => {
    //     const timer = setInterval(initTimer, 1000)
    //     return () => {
    //         clearInterval(timer);
    //     } 
    // }, [initTimer]);

    const handleModal = () => {
        dispatch(setBodyModalParamsAction('INFO_ACCOUNT', account));
    }

    return (
        <tr>
            <td className="blue-link-text align-left">
                <a onClick={handleModal}>{accountRS}</a>
            </td>
            <td className="align-right">
                <a>{numberToLocaleString(effectiveBalanceAPL)}</a>
            </td>
            <td className="align-right">
                <a>{handleFormatTime(hitTime)}</a>
            </td>
            <td className="align-right"><a>{deadline}</a>
            </td>
            {/* <td className="align-right">
                <a>{remaining}</a>
            </td> */}
        </tr>
    );
}

export default Generator;
