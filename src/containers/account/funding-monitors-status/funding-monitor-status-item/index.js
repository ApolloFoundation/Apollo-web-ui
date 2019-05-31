import React from 'react';
import {connect} from 'react-redux';

import {setBodyModalParamsAction} from "../../../../modules/modals";


const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
})

const FundingMonitorItem = (props) => (
    <tr>
        <td className={'blue-link-text'}>
            <a
                onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.recipient)}
            >
                {props.recipientRS}
            </a>
        </td>
        <td>
            {props.property}
        </td>
        <td>
            {props.value ? props.value : '-'}
        </td>
        <td className="align-right">
            <div className="btn-box inline">
                <a className={'btn btn-default'}
                   onClick={() => props.setBodyModalParamsAction('REMOVE_MONITOR', {
                       recipient: props.recipient,
                       property: props.property,
                   })}
                >
                    Remove
                </a>
            </div>

        </td>
    </tr>
);

export default connect(null, mapDispatchToProps)(FundingMonitorItem)