import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {NotificationManager} from 'react-notifications'
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {stopMonitor} from "../../../../actions/monitors";
import { getAdminPasswordSelector, getDecimalsSelector } from '../../../../selectors';

const mapStateToProps  = state => ({
    adminPassword: getAdminPasswordSelector(state),
    decimals: getDecimalsSelector(state),
})

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction : (type, value) => dispatch(setBodyModalParamsAction(type, value))
});

const stopMonitorAction = (props) => {
    const monitor = stopMonitor({
        account: props.accountRS,
        property: props.property,
        adminPassword: props.adminPassword,
        feeATM: 0
    })

    if (monitor && !monitor.errorCode) {
        NotificationManager.success('The funding monitor has been stopped.', null, 5000);
    }
}

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
            {props.amount ? props.amount/props.decimals : '?'}
        </td>
        <td>
            {props.threshold ? props.threshold/props.decimals : '?'}
        </td>
        <td>
            {props.interval ? props.interval : '?'}
        </td>
        <td
            className={'align-right btn-box inline'}
        >
            <Link
                to={`/funding-monitors/${props.accountRS}/${props.property}`}
                className={'btn btn-default'}
            >
                Status
            </Link>
            <button
                type={'button'}
                className={'btn btn-default'}
                onClick={() => stopMonitorAction(props)}
            >
                Stop
            </button>
        </td>
    </tr>
)

export default connect(mapStateToProps, mapDispatchToProps)(MonitorItem)
