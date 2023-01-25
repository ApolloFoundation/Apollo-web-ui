/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import classNames from "classnames";
import SiteHeader from '../../components/site-header';
import {getAccountPropertiesAction} from '../../../actions/account/index';
import {setBodyModalParamsAction} from "../../../modules/modals";
import { TableLoader } from '../../components/TableLoader';
import FundingMonitorItem from "./funding-monitor-status-item";

const FundingMonitorsStatus = ({ match }) => {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        recipientRS: null,
        incoming: true
    });

    const getAccountProperties = useCallback(async ({ firstIndex, lastIndex }) => {
        const properties = await dispatch(getAccountPropertiesAction({
            setter: match.params.account,
            property: match.params.property,
            firstIndex,
            lastIndex,
        }));

        if (properties) {
            setState({
                properties: properties.properties,
                recipientRS: properties.recipientRS,
                incoming: true
            })

            return properties.properties;
        }
        return [];
    }, [dispatch, match.params.account, match.params.property]);

    const handleAddMonitoringAccountModal = () => {
        dispatch(setBodyModalParamsAction('ADD_MONITORED_ACCOUNT', {
            property: match.params.property
        }));
    }

    const handleAccountInfoModal = () => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', match.params.account));

        return (
            <div className="page-content">
                <SiteHeader pageTitle='Funding Monitor Status'>
                    <Link
                        to='/funding-monitors'
                        className={classNames({
                            'btn': true,
                            'primary': true,
                        })}
                    >
                        Funding monitors
                    </Link>
                    <a
                        className={classNames({
                            'btn': true,
                            'primary': true,
                        })}
                        style={{marginLeft: 10}}
                        onClick={handleAddMonitoringAccountModal}
                    >
                        Add Monitored Account
                    </a>
                </SiteHeader>
                <div className="page-body container-fluid">
                    <div className="my-transactions">
                        <div className="transactions-filters" style={{paddingTop: 0}}>
                            <div className="monitors-table">
                                <tr>
                                    <td>Account: </td>
                                    <td>
                                        <a onClick={handleAccountInfoModal}>
                                            {match.params.account}
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Property: </td>
                                    <td>{match.params.property}</td>
                                </tr>
                            </div>
                        </div>
                        <TableLoader
                            headersList={[ 
                                {
                                    name: state.incoming ? 'Setter' : 'Recipient',
                                    alignRight: false,
                                },
                                {
                                    name: 'Property',
                                    alignRight: false,
                                },
                                {
                                    name: 'Value',
                                    alignRight: false,
                                },
                                {
                                    name: 'Actions',
                                    alignRight: true,
                                },
                            ]}
                            emptyMessage="No properties found."
                            TableRowComponent={FundingMonitorItem}
                            dataLoaderCallback={getAccountProperties}
                        />
                    </div>
                </div>
            </div>
        );
}

export default FundingMonitorsStatus;
