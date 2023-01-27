/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { Link } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setBodyModalParamsAction} from "modules/modals";
import {formatTimestamp} from "helpers/util/time";
import { getDecimalsSelector } from 'selectors';

const TradeHistoryItem = ({ ...transfer }) => {
    const dispatch = useDispatch();
    const decimals = useSelector(getDecimalsSelector);

    const handleTime = (time) => dispatch(formatTimestamp(time));

    const handleShowModal = (account) => () => {
        dispatch(setBodyModalParamsAction('INFO_ACCOUNT', account));
    }

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
            <td className="align-right">{transfer.quantityATU/ Math.pow(10, transfer.decimals)}</td>
            <td className="align-right">{(transfer.priceATM / decimals) * Math.pow(10, transfer.decimals)}</td>
            <td className="align-right" >{((transfer.quantityATU )/ transfer.decimals) * ((transfer.priceATM / decimals) * transfer.decimals)}</td>
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
