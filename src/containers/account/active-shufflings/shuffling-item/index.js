import React from 'react';
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
                props.stage === 4 &&
                'Expired'
            }
            {
                props.stage === 5 &&
                'Done'
            }
        </td>
        <td>APL</td>
        <td>{props.amount / 100000000}</td>
        {
            !props.finished &&
            <td>{props.blocksRemaining}</td>
        }

        <td className="align-right">{props.registrantCount} / {props.participantCount}</td>
        <td className="blue-link-text align-right">
            <a onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.shuffling)}>
                {props.shuffling}
            </a>
        </td>
        {
            !props.finished &&
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
    </tr>
);

export default connect(null, mapDispatchToProps)(ShufflingItem)