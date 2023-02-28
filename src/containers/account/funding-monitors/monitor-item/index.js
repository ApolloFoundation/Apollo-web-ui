import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {NotificationManager} from 'react-notifications'
import {setBodyModalParamsAction} from "modules/modals";
import {stopMonitorThunk} from "actions/monitors";
import { getAdminPasswordSelector, getDecimalsSelector } from 'selectors';
import { bigIntDivision, bigIntFormat } from 'helpers/util/bigNumberWrappers';

const MonitorItem = (props) => {
    const dispatch = useDispatch();
    const decimals = useSelector(getDecimalsSelector);
    const adminPassword = useSelector(getAdminPasswordSelector);

    const stopMonitorAction = () => {
        const monitor = dispatch(stopMonitorThunk({
            account: props.accountRS,
            property: props.property,
            adminPassword: adminPassword,
            feeATM: 0
        }))
    
        if (monitor && !monitor.errorCode) {
            NotificationManager.success('The funding monitor has been stopped.', null, 5000);
        }
    }

    const handleInfoAccountModal = () => {
        dispatch(setBodyModalParamsAction('INFO_ACCOUNT', props.accountRS));
    }

    return (
        <tr>
            <td>
                <a
                    className='blue-link-text'
                    onClick={handleInfoAccountModal}
                >
                    {props.accountRS}
                </a>
            </td>
            <td
                className='align-left'
            >
                {props.property ?? '?'}
            </td>
            <td className='align-right'>
                {props.amount ? bigIntFormat(bigIntDivision(props.amount, decimals)) : '?'}
            </td>
            <td>
                {props.threshold ? bigIntFormat(bigIntDivision(props.threshold, decimals)) : '?'}
            </td>
            <td>
                {props.interval ?? '?'}
            </td>
            <td className='align-right btn-box inline'>
                <Link
                    to={`/funding-monitors/${props.accountRS}/${props.property}`}
                    className={'btn btn-default'}
                >
                    Status
                </Link>
                <button
                    type='button'
                    className='btn btn-default'
                    onClick={stopMonitorAction}
                >
                    Stop
                </button>
            </td>
        </tr>
    )
}

export default MonitorItem;
