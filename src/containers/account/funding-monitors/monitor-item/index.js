import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {startMonitor, stopMonitor} from "../../../../actions/monitors";

const mapStateToProps  = state => ({
    adminPassword: state.account.adminPassword
})

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction : (type, value) => dispatch(setBodyModalParamsAction(type, value))
});

const MonitorItem = (props) => (
    <tr>
        <td>
            <a
                className={'blue-link-text'}
                onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.accountRS)}
            >
                {props.accountRS}
            </a>
        </td>
        <td
            className={'align-left'}
        >
            {props.property ? props.property : '?'}
        </td>
        <td
            className={'align-right'}
        >
            {props.amount ? props.amount : '?'}
        </td>
        <td>
            {props.threshold ? props.threshold : '?'}
        </td>
        <td>
            {props.interval ? props.interval : '?'}
        </td>
        <td
            className={'align-right btn-box inline'}
        >
            <a
                className={'btn primary blue'}
            >
                Status
            </a>
            <a
                className={'btn primary default'}
                onClick={() => stopMonitor({
                    account: props.accountRS,
                    property: props.property,
                    adminPassword: props.adminPassword,
                    feeATM: 0
                })}
            >
                Stop
            </a>
        </td>
    </tr>
)

export default connect(mapStateToProps, mapDispatchToProps)(MonitorItem)