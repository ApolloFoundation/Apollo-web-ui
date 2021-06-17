import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {stopMonitor} from "../../../../actions/monitors";
import {NotificationManager} from 'react-notifications'
import Button from "../../../components/button";

const mapStateToProps  = state => ({
    adminPassword: state.account.adminPassword,
    decimals: state.account.decimals,
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
        setTimeout(() => {
            props.reloadCallback()
        }, 1000)
    }
}

const MonitorItem = (props) => (
    <tr>
        <td>
            <Button
                color="blue-link"
                onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.accountRS)}
                name={props.accountRS}
            />
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
            
            <Button
                onClick={() => stopMonitorAction(props)}
                name={"Stop"}
            />
        </td>
    </tr>
)

export default connect(mapStateToProps, mapDispatchToProps)(MonitorItem)
