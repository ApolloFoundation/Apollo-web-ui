/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { Link } from 'react-router-dom';
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { connect } from "react-redux";
import { ONE_APL } from '../../../../constants';

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

const ShufflingItem = (props) => {
    return (
        <tr>
            <td className="blue-link-text">
                <a onClick={() => props.getTransaction(props.shuffling)}>
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
            <td className={'blue-link-text'}>
                {
                    props.holdingType === 0 &&
                    'APL'
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
            <td>{props.amount / ONE_APL}</td>
            {
                props.blocksRemaining ?
                    <td>{props.blocksRemaining}</td> : null
            }

            <td className="align-right">{props.registrantCount} / {props.participantCount}</td>
            <td className="blue-link-text align-right">
                <a onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.issuer)}>
                    {props.issuerRS}
                </a>
            </td>
            {
                props.blocksRemaining && props.stage !== 1 ?
                    <td className="align-right">
                        <div className="btn-box inline">
                            <a className={'btn primary blue'}
                                onClick={() => props.setBodyModalParamsAction('START_SHUFFLING', props.shuffling)}>
                                Join
                            </a>
                        </div>
                    </td> : null
            }
            {
                props.blocksRemaining && props.stage === 1 ?
                    <td className="align-right">
                        In Progress
                    </td> : null
            }
        </tr>
    )
};

export default connect(null, mapDispatchToProps)(ShufflingItem)
