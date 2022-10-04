/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {Link} from 'react-router-dom';
import SiteHeader from '../../components/site-header';
import { DatastoregeTags } from './DatastorageTags';
import { DataStorageFiles } from './DataStorageFiles';
import { AccountForm } from './DataStorageForms/AccountForm';
import { TagForm } from './DataStorageForms/TagForm';

const DataStorage = () => (
    <div className="page-content data-storage">
        <SiteHeader pageTitle='Data Cloud'>
            <Link to='/data-storage' className="btn btn-green btn-sm">
                Reset
            </Link>
        </SiteHeader>
        <div className="page-body container-fluid">
            <div className="data-storage">
                <div className="row">
                    <div className="col-md-12 p-0">
                        <div className="transactions-filters p-0">
                            <div className="search-bar row">
                                <AccountForm />
                                <TagForm />
                            </div>
                        </div>
                        <DatastoregeTags />
                    </div> 
                    <DataStorageFiles />
                </div>
            </div>
        </div>
    </div>
);

export default DataStorage;
