import React from 'react';
import {Link} from 'react-router-dom';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from "react-redux";

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

const ShufflingItem = (props) => (
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
                    'APl'
            }
            {
                props.holdingType === 1 &&
                <Link
                    to={'/asset-exchange/' + props.holding}
                >
                    {props.holdingInfo.name} (Asset)
                </Link>
            }
            {
                props.holdingType === 2 &&
                <Link
                    to={'/exchange-booth/' + props.holding}
                >
                    {props.holdingInfo.name} (Currency)
                </Link>
            }

        </td>
        <td>{props.amount / 100000000}</td>
        {
            !props.finished &&
            <td>{props.blocksRemaining}</td>
        }

        <td className="align-right">{props.registrantCount} / {props.participantCount}</td>
        <td className="blue-link-text align-right">
            <a onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.issuer)}>
                {props.issuerRS}
            </a>
        </td>
        {
            !props.finished && props.stage !== 1 &&
            <td className="align-right">
                <div className="btn-box inline">
                    <a className={'btn primary blue'}
                       onClick={() => props.setBodyModalParamsAction('START_SHUFFLING', props.shuffling)}
                    >
                        Join
                    </a>
                </div>

            </td>
        }
        {
            !props.finished && props.stage === 1 &&
            <td className="align-right">
                In Progress
            </td>
        }
    </tr>
);

export default connect(null, mapDispatchToProps)(ShufflingItem)