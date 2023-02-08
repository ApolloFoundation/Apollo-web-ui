/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from "react";
import {useDispatch} from "react-redux";
import SiteHeader from "containers/components/site-header";
import {getGeneratorsAction} from "actions/generators";
import Generator from "containers/account/generators/generator";
import TopPageBlocks from 'containers/components/tob-page-blocks';
import { useFormatTimestamp } from "hooks/useFormatTimestamp";
import { TableLoader } from "containers/components/TableLoader";

const Generators = () =>  {
    const dispatch = useDispatch();
    const handleTime = useFormatTimestamp();
    const [state, setState] = useState({
        lastBlockTime: "",
        height: "",
        timestamp: 0,
        activeForgers: 0,
    });

    const getGenerators = useCallback(() => dispatch(getGeneratorsAction())
        .then(generators => {
            setState({
                height: generators.height,
                activeForgers: generators.activeCount,
                timestamp: generators.timestamp,
                lastBlockTime: handleTime(generators.timestamp),
            })
            return generators?.generators ?? [];
        }), [dispatch, handleTime]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='Generators' />
            <div className="page-body container-fluid">
                <div className="">
                    <TopPageBlocks
                        cards={[
                            {
                                label: 'Last Block',
                                value: state.lastBlockTime
                            }, {
                                label: 'Height',
                                value: state.height
                            }, {
                                label: 'Active Forgers',
                                value: state.activeForgers
                            }
                        ]}
                    />
                    <div className="info-box info">
                        Information in this table is delayed by up to 30 seconds, use the desktop wallet for more up
                        to date information.
                    </div>
                    <TableLoader
                        headersList={[
                            {
                                name: 'Account',
                                alignRight: false
                            }, {
                                name: 'Effective Balance',
                                alignRight: true
                            }, {
                                name: 'Hit Time',
                                alignRight: true
                            }, {
                                name: 'Deadline',
                                alignRight: true
                            }
                        ]}
                        TableRowComponent={Generator}
                        className='mb-3'
                        emptyMessage='Active generators not yet initialized.'
                        dataLoaderCallback={getGenerators}
                    />
                </div>
            </div>
        </div>
    )
}

export default Generators;