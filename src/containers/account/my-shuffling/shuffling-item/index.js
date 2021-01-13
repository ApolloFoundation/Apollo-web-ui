/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { Link } from 'react-router-dom';
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  decimals: state.account.decimals,
  ticker: state.account.ticker,
});

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
                    props.ticker
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
            <td>{props.amount / props.decimals}</td>
            <td>{props.blocksRemaining || ''}</td>
            <td className="align-right">{props.registrantCount} / {props.participantCount}</td>
            <td className="blue-link-text align-right">
                <a onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.issuer)}>
                    {props.issuerRS}
                </a>
            </td>
        </tr>
    )
};

export default connect(mapStateToProps, mapDispatchToProps)(ShufflingItem)
