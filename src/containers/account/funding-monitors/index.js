/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useState, useCallback } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link} from 'react-router-dom'
import SiteHeader from 'containers/components/site-header'
import {setBodyModalParamsAction} from "modules/modals";
import {getFundingMonitorsAction} from 'actions/monitors'
import InfoBox from 'containers/components/info-box'
import { TableLoader } from 'containers/components/TableLoader';
import { getAdminPasswordSelector } from 'selectors';
import MonitorItem from './monitor-item';

const FundingMonitors = () => {
    const dispatch = useDispatch();
    const adminPassword = useSelector(getAdminPasswordSelector);
    const [state, setState] = useState({
        monitors: null,
        isLoaded: false,
    });

    const getFundingMointors = useCallback(async ({ firstIndex, lastIndex }) => {
        const monitors = await dispatch(getFundingMonitorsAction({
            firstIndex,
            lastIndex,
            adminPassword,
        }));

        if (monitors && !monitors.errorCode) {
            setState({
                monitors: monitors.monitors,
                isLoaded: true
            });
            return monitors.monitors;
        }
        setState({
            monitors,
            isLoaded: true
        })
        return [];
    }, [dispatch, adminPassword]);

    const handleAddMonitorModal = () => {
        dispatch(setBodyModalParamsAction("ADD_MONITOR", getFundingMointors));
    }

    return (
        <div className="page-content">
            <SiteHeader pageTitle='Funding monitors'>
                <a className="btn btn-green btn-sm" onClick={handleAddMonitorModal}>
                    Add monitor
                </a>
            </SiteHeader>
            <div className="page-body container-fluid">
                <div className="funding-monitors">
                    {/*<div className="info-box danger">*/}
                        {/*<p>Incorrect &quot;adminPassword&quot; (locked for 1 hour, too many incorrect password*/}
                            {/*attempts)</p>*/}
                    {/*</div>*/}
                    {
                        state.monitors &&
                        state.monitors.errorCode &&
                        state.monitors.errorCode === 3 &&
                        <InfoBox default>
                            An admin password was not specified. Please set an admin password on the
                            <Link to='/settings'>
                                &nbsp;settings&nbsp;
                            </Link>
                            page.
                        </InfoBox>
                    }
                    {
                        state.monitors &&
                        state.monitors.errorCode &&
                        state.monitors.errorCode === 4 &&
                        <InfoBox default>
                            An admin password is incorrect. Please set an admin password on the&nbsp;
                            <Link to='/settings'>
                                &nbsp;settings&nbsp;
                            </Link>
                            page.
                        </InfoBox>
                    }

                        <TableLoader
                            headersList={[
                                {
                                    name: 'Account',
                                    alignRight: false,
                                },
                                {
                                    name: 'Property',
                                    alignRight: false,
                                },
                                {
                                    name: 'Amount',
                                    alignRight: true,
                                },
                                {
                                    name: 'Threshold',
                                    alignRight: false,
                                },
                                {
                                    name: 'Interval',
                                    alignRight: false,
                                },
                                {
                                    name: 'Action',
                                    alignRight: true,
                                },
                            ]}
                            TableRowComponent={MonitorItem}
                            emptyMessage='No monitors found.'
                            dataLoaderCallback={getFundingMointors}
                        />
                </div>
            </div>
        </div>
    );
}

export default FundingMonitors;
