/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { getDecimalsSelector, getTickerSelector } from '../../../../selectors';

const ShufflingItem = (props) => {
    const dispatch = useDispatch();
    const decimals = useSelector(getDecimalsSelector);
    const ticker = useSelector(getTickerSelector);

    const handleGetTransaction = () => props.getTransaction(props.shuffling);

    const handleGetAccountInfoModal = () => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', props.issuer));

    return (
        <tr>
            <td className="blue-link-text">
                <a onClick={handleGetTransaction}>
                    {props.shuffling}
                </a>
            </td>
            <td>
                {
                    props.stage === 0 &&
                    'Registration'
                }
                {
                    props.stage === 1 &&
                    'Processing'
                }
                {
                    props.stage === 4 &&
                    'Expired'
                }
                {
                    props.stage === 5 &&
                    'Done'
                }
            </td>
            <td className='blue-link-text'>
                {
                    props.holdingType === 0 &&
                    ticker
                }
                {
                    props.holdingType === 1 &&
                    <Link
                        to={'/asset-exchange/' + props.holding}
                    >
                        {props.holding} (Asset)
                    </Link>
                }
                {
                    props.holdingType === 2 &&
                    <Link
                        to={'/exchange-booth/' + props.holdingInfo.name}
                    >
                        {props.holding} (Currency)
                    </Link>
                }

            </td>
            <td>{props.amount / decimals}</td>
            <td>{props.blocksRemaining || ''}</td>
            <td className="align-right">{props.registrantCount} / {props.participantCount}</td>
            <td className="blue-link-text align-right">
                <a onClick={handleGetAccountInfoModal}>
                    {props.issuerRS}
                </a>
            </td>
        </tr>
    )
};

export default ShufflingItem;
