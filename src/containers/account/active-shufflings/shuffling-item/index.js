/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { getAccountInfoSelector } from '../../../../selectors';
import { getTransactionAction } from '../../../../actions/transactions';

const ShufflingItem = (props) => {
    const dispatch = useDispatch();
    const { ticker, decimals, account } = useSelector(getAccountInfoSelector);

    const handleTransactionModal = async () => {
        const transaction = await dispatch(getTransactionAction({
            transaction: props.shuffling,
            account,
        }));
        if (transaction) {
            dispatch(setBodyModalParamsAction('INFO_TRANSACTION', transaction));
        }
    }

    const handleAccountInfoModal = () =>
        dispatch(setBodyModalParamsAction('INFO_ACCOUNT', props.issuer));

    const handleStartShufflingModal = () =>
        dispatch(setBodyModalParamsAction('START_SHUFFLING', props.shuffling));

    return (
        <tr>
            <td>
                <span className="blue-link-text" onClick={handleTransactionModal}>
                    {props.shuffling}
                </span>
            </td>
            <td>
                { props.stage === 0 && 'Registration'}
                { props.stage === 1 && 'Processing'}
                { props.stage === 4 && 'Expired' }
                { props.stage === 5 && 'Done'}
            </td>
            <td className='blue-link-text'>
                { props.holdingType === 0 && ticker }
                { props.holdingType === 1 &&
                    <Link to={'/asset-exchange/' + props.holding}>
                        {props.holding} (Asset)
                    </Link>
                }
                {props.holdingType === 2 &&
                    <Link to={'/exchange-booth/' + props.holdingInfo.name}>
                        {props.holding} (Currency)
                    </Link>
                }
            </td>
            <td>{props.amount / decimals}</td>

            { props.blocksRemaining &&  <td>{props.blocksRemaining}</td>}

            <td className="align-right">{props.registrantCount} / {props.participantCount}</td>
            <td className="align-right">
                <span className="blue-link-text" onClick={handleAccountInfoModal}>{props.issuerRS}</span>
            </td>
            { (props.blocksRemaining && props.stage !== 1) &&
                <td className="align-right">
                    <div className="btn-box inline">
                        <span className='btn btn-default' onClick={handleStartShufflingModal}>
                            Join
                        </span>
                    </div>
                </td>
            }
            {(props.blocksRemaining && props.stage === 1) &&
                <td className="align-right">
                    In Progress
                </td>
            }
        </tr>
    )
};

export default ShufflingItem;
