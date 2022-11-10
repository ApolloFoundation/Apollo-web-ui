/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {searchAliases} from "../../../actions/aliases";
import SiteHeader from '../../components/site-header'
import { TableLoader } from '../../components/TableLoader';
import { SearchAliasForm } from './SearchAliasesForm';
import Alias from "./alias";

const SearchAliases = () => {
    const dispatch = useDispatch();
    const [aliasPrefix, setAliasPrefix] = useState('');

    const getAliases = useCallback(async ({ firstIndex, lastIndex}) => {
        const aliases = await dispatch(searchAliases({
            firstIndex,
            lastIndex,
            aliasPrefix,
        }));
        if (aliases && !aliases.aliases.length) {
            NotificationManager.error('No aliases found.', 'Error', 5000);
            return [];
        } 
        return aliases?.aliases || [];
    }, [dispatch, aliasPrefix]);


    const handleSearchAlias = useCallback(({ alias }) => {
        if(!alias || alias.length < 2) {
            NotificationManager.error('Alias name must be no less than 2 symbols.', 'Error', 5000);
            return
        }
        setAliasPrefix(alias);
    }, [setAliasPrefix]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='Aliases' />
            <div className="page-body container-fluid">
                <div className="data-storage">
                    <div className="row">
                        <div className="col-md-12 p-0">
                            <div className="transactions-filters">
                                <div className="search-bar row" />
                                <SearchAliasForm onSubmit={handleSearchAlias} />
                            </div>
                        </div>
                        <TableLoader
                            headersList={[
                                {
                                    name: 'Aliases',
                                    alignRight: false
                                },{
                                    name: 'Type Value',
                                    alignRight: false
                                },{
                                    name: 'Status',
                                    alignRight: false
                                },{
                                    name: 'Price',
                                    alignRight: false
                                },
                                {
                                    name: 'Action',
                                    alignRight: true
                                }
                            ]}
                            TableRowComponent={Alias}
                            className='no-min-height mb-3'
                            emptyMessage='Enter the Alias you want to find (no less than 2 symbols)'
                            dataLoaderCallback={getAliases}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchAliases;