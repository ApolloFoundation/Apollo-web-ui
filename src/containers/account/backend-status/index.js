/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import Task from './task';
import SiteHeader from '../../components/site-header';
import CustomTable from '../../components/tables/table';


const mapStateToProps = state => ({
    blockchainStatus: state.account.blockchainStatus,
});

class BackendStatus extends React.Component {
    render () {
        const {blockchainStatus} = this.props;

        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Backend Tasks Status'}
                />
                <div className="page-body container-fluid">
                    {blockchainStatus && blockchainStatus.status && (
                        <CustomTable
                            header={[
                                {
                                    name: 'Name',
                                    alignRight: false
                                },{
                                    name: 'Description',
                                    alignRight: false
                                },{
                                    name: 'Percent complete',
                                    alignRight: false
                                },{
                                    name: 'State of task',
                                    alignRight: false
                                },{
                                    name: 'Started',
                                    alignRight: false
                                },{
                                    name: 'Finished',
                                    alignRight: false
                                },
                            ]}
                            TableRowComponent={Task}
                            tableData={blockchainStatus.status.tasks}
                            className={'no-min-height mb-3'}
                            emptyMessage={'No tasks found.'}
                            itemsPerPage={15}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(BackendStatus);