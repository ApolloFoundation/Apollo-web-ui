/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import uuid from "uuid";
import {connect} from "react-redux";
import {getDeleteHistory} from "../../../actions/delete-history";
import DeleteItem from "./deletes";
import {BlockUpdater} from "../../block-subscriber";
import ContentHendler from '../../components/content-hendler'

import CustomTable from '../../components/tables/table';

class DeleteHistory extends React.Component {

    state = {
        deletes: null,
    };

    componentWillMount() {
        this.getDeleteHistory(this.props.account);
    }

    listener = data => {
        this.getDeleteHistory(this.props.account);
    };

    componentDidMount() {
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.account && nextProps.account.length > 0) {
            this.getDeleteHistory(nextProps.account);
        }
    };

    getDeleteHistory = account => {
        this.props.getDeleteHistory(account).then(history => this.setState({
                deletes: history ? history.deletes : null
            })
        )
    };

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Delete History'}
                />
                <div className="page-body container-fluid">
                    <CustomTable 
                        header={[
                            {
                                name: 'Transaction',
                                alignRight: false
                            },{
                                name: 'Asset',
                                alignRight: false
                            },{
                                name: 'Date',
                                alignRight: false
                            },{
                                name: 'Quantity',
                                alignRight: true
                            }
                        ]}
                        page={this.state.page}
                        className={'mb-3'}
                        TableRowComponent={(el) => <DeleteItem delete={el}/>}
                        tableData={this.state.deletes}
                        isPaginate
                        emptyMessage={'No delete history found.'}
                    />
                </div>
            </div>
        );
    }
}

const
    mapStateToProps = state => ({
        account: state.account.accountRS,

    });

const
    mapDispatchToProps = dispatch => ({
        getDeleteHistory: account => dispatch(getDeleteHistory(account))
    });

export default connect(mapStateToProps, mapDispatchToProps)

(
    DeleteHistory
)
;