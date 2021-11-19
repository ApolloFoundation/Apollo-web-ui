/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from "react-redux";
import { getDeleteHistory } from "../../../actions/delete-history";
import { BlockUpdater } from "../../block-subscriber";
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import DeleteItem from "./deletes";
import SiteHeader from '../../components/site-header'
import ContentHendler from '../../components/content-hendler'

import CustomTable from '../../components/tables/table';

class DeleteHistory extends React.Component {

    state = {
        deletes: null,
        page: 1,
        perPage: 15,
        firstIndex: 0,
        lastIndex: 15,
        loader: false
    };

    listener = data => {
        this.getDeleteHistory(this.props.account);
    };

    componentDidMount() {
        this.getDeleteHistory(this.props.account);
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

    getDeleteHistory = (account) => {
        this.props.getDeleteHistory(account, this.state.firstIndex, this.state.lastIndex).then(history => {
            this.setState({
                deletes: history ? history.deletes : null
            })
        })
    };

    onPaginate(page) {

        let reqParams = {
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15
        };

        this.setState(reqParams, () => {
            this.getDeleteHistory(this.props.account)
        });
    }

    render() {
        let { page, deletes } = this.state;
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
                            }, {
                                name: 'Asset',
                                alignRight: false
                            }, {
                                name: 'Date',
                                alignRight: false
                            }, {
                                name: 'Quantity',
                                alignRight: true
                            }
                        ]}
                        previousHendler={() => this.onPaginate(this.state.page - 1)}
                        nextHendler={() => this.onPaginate(this.state.page + 1)}
                        page={page}
                        className={'mb-3'}
                        TableRowComponent={(el) => <DeleteItem delete={el} />}
                        tableData={deletes}
                        isPaginate={true}
                        emptyMessage={'No asset deletion history available.'}
                        itemsPerPage={15}
                    />
                </div>
            </div>
        )
    }
}

const
    mapStateToProps = state => ({
        account: state.account.accountRS,

    });

const
    mapDispatchToProps = dispatch => ({
        getDeleteHistory: (account, firstIndex, lastIndex) => dispatch(getDeleteHistory(account, firstIndex, lastIndex))
    });

export default connect(mapStateToProps, mapDispatchToProps)

    (
        DeleteHistory
    )
    ;
