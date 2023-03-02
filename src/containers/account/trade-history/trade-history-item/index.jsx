/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setBodyModalParamsAction} from "modules/modals";
import {formatTimestamp} from "helpers/util/time";
import { getDecimalsSelector } from 'selectors';
import { bigIntDecimalsDivision, bigIntDivision, bigIntFormat, bigIntMultiply } from 'helpers/util/bigNumberWrappers';

const TradeHistoryItem = ({ ...transfer }) => {
    const dispatch = useDispatch();
    const decimals = useSelector(getDecimalsSelector);

    const handleTime = (time) => dispatch(formatTimestamp(time));

    const handleShowModal = (account) => () => {
        dispatch(setBodyModalParamsAction('INFO_ACCOUNT', account));
    }

    const total = useMemo(() => {
        const num1 = bigIntDivision(transfer.quantityATU, transfer.decimals);
        const num2 = bigIntDivision(transfer.priceATM, decimals);
        const num3 = bigIntMultiply(num2, transfer.decimals);
        return bigIntMultiply(num3, num1);
    }, [transfer.quantityATU, transfer.decimals, transfer.priceATM, decimals]);

    if (!transfer) return (<tr></tr>);

    return (
        <tr>
            <td className="blue-link-text">
                <Link to={'/asset-exchange/' + transfer.asset}>{transfer.name}</Link>
            </td>
            <td>
                {handleTime(transfer.timestamp)}
                <a><span className="info"/></a>
            </td>
            <td className="">{transfer.tradeType}</td>
            <td className="align-right">{bigIntFormat(bigIntDecimalsDivision(transfer.quantityATU, transfer.decimals))}</td>
            <td className="align-right">
                {bigIntFormat(bigIntMultiply(bigIntDivision(transfer.priceATM, decimals), Math.pow(10, transfer.decimals)))}
            </td>
            <td className="align-right">{bigIntFormat(total)}</td>
            <td className="blue-link-text">
                <a onClick={handleShowModal(transfer.buyer)}>{transfer.buyerRS}</a>
            </td>
            <td className="blue-link-text">
                <a onClick={handleShowModal(transfer.seller)}>{transfer.sellerRS}</a>
            </td>
        </tr>
    );
}

export default TradeHistoryItem;
