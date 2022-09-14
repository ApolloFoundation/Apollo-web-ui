/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {useDispatch} from 'react-redux';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {formatTimestamp} from "../../../../helpers/util/time";
import {getTransactionAction} from "../../../../actions/transactions";

export const DeleteItem = (props) => {
    const dispatch = useDispatch();

    const getTransactionInfo = async transaction => {
        return await dispatch(getTransactionAction({
            transaction,
            random: Math.random()
        }))
    };

    const handleModal = async () => {
        dispatch(setBodyModalParamsAction('INFO_TRANSACTION', await getTransactionInfo(props.delete.assetDelete)))
    }

    const handleTime = () => dispatch(formatTimestamp(props.delete.timestamp));

    return (
        <tr>
            <td className="align-left blue-link-text">
                <a onClick={handleModal}>
                    {props.delete.assetDelete}
                </a>
            </td>
            <td className="align-left">{props.delete.name}</td>
            <td>{handleTime()}</td>
            <td className="align-right">{props.delete.quantityATU / Math.pow(10, props.delete.decimals)}</td>
        </tr>
    );
}
