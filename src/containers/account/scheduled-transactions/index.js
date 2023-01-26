/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {NotificationManager} from "react-notifications";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux'
import classNames from "classnames";
import SiteHeader from 'containers/components/site-header'
import InfoBox from "containers/components/info-box";
import {setBodyModalParamsAction} from "modules/modals";
import {getScheduledTransactions, deleteScheduledTransactionAction} from "actions/scheduled-transactions";
import ContentHendler from "containers/components/content-hendler";
import { getAdminPasswordSelector } from 'selectors';
import { ScheduleTransactionTable } from './ScheduleTransactionTable';

const ScheduledTransactions = () => {
    const dispatch = useDispatch();
    const adminPassword = useSelector(getAdminPasswordSelector);
    const [state, setState] = useState({
        scheduledTransactions: null,
        errorCode: null,
    })

    const getScheduledTransactionsRequest = useCallback(async () => {
        const scheduledTransactions = await getScheduledTransactions({
            adminPassword,
        });
        
        if (scheduledTransactions && !scheduledTransactions.errorCode) {
            setState({
                scheduledTransactions: scheduledTransactions.scheduledTransactions,
                errorCode: null,
            })
        }

        if (scheduledTransactions && scheduledTransactions.errorCode) {
            setState({
                scheduledTransactions,
                errorCode: scheduledTransactions.errorCode,
            });
        }
    }, [ adminPassword]);

    const deleteScheduledTransaction = (transaction) => async () => {
        const deleteTransacrtio = await dispatch(
            deleteScheduledTransactionAction({adminPassword, transaction})
        );

        if (deleteTransacrtio) {
            if (deleteTransacrtio.errorCode) {
                NotificationManager.error(deleteTransacrtio.errorDescription, 'Error', 5000);

            } else {
                NotificationManager.success('Scheduled transaction has been deleted!', null, 5000);
                getScheduledTransactionsRequest();
            }
        }
    };

    const handleScheduleCurrency = () =>
        dispatch(setBodyModalParamsAction('SCHEDULE_CURRENCY', getScheduledTransactionsRequest));

    useEffect(() => {
        if (adminPassword) {
            getScheduledTransactionsRequest()
        } else {
            setState({
                scheduledTransactions: [],
                errorCode: 3,
            });
        }
    }, []);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='Scheduled transactions'>
                <span
                    className={classNames({
                        'btn': true,
                        'primary': true,
                        'disabled' : state.isPrivate
                    })}
                    onClick={handleScheduleCurrency}
                >
                    Schedule currency
                </span>
            </SiteHeader>
            <div className="page-body container-fluid">
                <div className="scheduled-transactions">
                    {
                        (state.errorCode &&
                        state.errorCode === 3) &&
                        <InfoBox default>
                            An admin password was not specified. Please set an admin password on the
                            <Link
                                to={'/settings'}
                            >
                                &nbsp;settings&nbsp;
                            </Link>
                            page.
                        </InfoBox>
                    }
                    <ContentHendler
                        items={state.scheduledTransactions}
                        emptyMessage='No schedules found.'
                    >
                        <ScheduleTransactionTable
                            scheduledTransactions={state.scheduledTransactions}
                            deleteScheduledTransaction={deleteScheduledTransaction}    
                        />
                    </ContentHendler>
                </div>
            </div>
        </div>
    );
}

export default ScheduledTransactions;