/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {setBodyModalParamsAction } from "modules/modals";
import { formatTimestamp } from "helpers/util/time";
import { getDecimalsSelector } from 'selectors';
import { bigIntDivision, bigIntFormat } from 'helpers/util/bigNumberWrappers';

const Block = (props) => {
    const dispatch = useDispatch();
    const decimals = useSelector(getDecimalsSelector);

    const {height, totalAmountATM, timestamp, totalFeeATM, numberOfTransactions,
      generator, generatorRS, payloadLength, baseTarget} = props;

    const pad = (value, size) => {
        if (typeof(size) !== "number") {
            size = 2;
        }

        while (value.toString().length < size) {
            value = "0" + value;
        }
        return value;
    };

    const handleInfoBlockModal = () => dispatch(setBodyModalParamsAction('INFO_BLOCK', height));

    const handleTime = () => dispatch(formatTimestamp(timestamp));

    const handleInfoAccountModal = () => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', generator));

    return (
        <tr>
            <td className="blue-link-text">
                <a onClick={handleInfoBlockModal}>{height}</a>
            </td>
            <td className="align-right">
                <p>{handleTime()}</p>
            </td>
            <td className="align-right">{bigIntFormat(bigIntDivision(totalAmountATM, decimals))}</td>
            <td className="align-right">{bigIntFormat(bigIntDivision(totalFeeATM, decimals))}</td>
            <td className="align-right">{numberOfTransactions}</td>
            <td className="blue-link-text">
                <a onClick={handleInfoAccountModal}>{generatorRS}</a>
            </td>
            <td className="align-right">
                <p>{payloadLength} B</p>
            </td>
            <td className="align-right">
                {pad(Math.round(baseTarget / 153722867 * 100), 4)} %
            </td>
        </tr>
    );
}

export default Block;
