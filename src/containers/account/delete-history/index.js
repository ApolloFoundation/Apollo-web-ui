/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import uuid from "uuid";
import { connect } from "react-redux";
import { getDeleteHistory } from "../../../actions/delete-history";
import DeleteItem from "./deletes";
import { BlockUpdater } from "../../block-subscriber";
import ContentHendler from '../../components/content-hendler'
import classNames from 'classnames';

import CustomTable from '../../components/tables/table';

class DeleteHistory extends React.Component {

    state = {
        deletes: null,
        page: 1,
        perPage: 16,
        firstIndex: 0,
        lastIndex: 15,
        loader: false
    };

    loaderContainer = { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }

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
        }
        )
    };

    onNextClick = () => {
        this.paginationClick('next')
    }

    onPreviousClick = () => {
        this.paginationClick('previous')
    }

    paginationClick = (clickDirection) => {
        const { page, perPage } = this.state;
        const { getDeleteHistory, account } = this.props;
        const paginationParams = { ...this.state }
        switch (clickDirection) {
            case 'next':
                paginationParams.page = this.state.page + 1
                paginationParams.firstIndex = (page + 1) * perPage - perPage - 1
                paginationParams.lastIndex = (page + 1) * perPage - 1
                paginationParams.loader = false;
                this.setState({ ...paginationParams })
                break;
            case 'previous':
                paginationParams.page = this.state.page - 1
                paginationParams.firstIndex = ((page - 1) * perPage - perPage - 1) >= 0 ? ((page - 1) * perPage - perPage - 1) : 0
                paginationParams.lastIndex = (page - 1) * perPage - 1
                paginationParams.loader = false;
                this.setState({ ...paginationParams })
                break;
            default:
                return null;
        }
        this.setState({ loader: true });
        getDeleteHistory(account, paginationParams.firstIndex, paginationParams.lastIndex).then(history => {
            paginationParams.deletes = history && history.deletes
            this.setState({ ...paginationParams })
        })
    }

    render() {
        let { page, deletes, loader } = this.state;
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Delete History'}
                />
                <div className="page-body container-fluid">
                    {!loader ? <CustomTable
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
                        previousHendler={this.onPreviousClick}
                        nextHendler={this.onNextClick}
                        page={page}
                        className={'mb-3'}
                        TableRowComponent={(el) => <DeleteItem delete={el} />}
                        tableData={deletes}
                        isPaginate={true}
                        emptyMessage={'No asset deletion history available.'}
                    /> :
                        <div style={this.loaderContainer} >
                            <div className={'align-items-center loader-box'}>
                                <div className="ball-pulse">
                                    <div />
                                    <div />
                                    <div />
                                </div>
                            </div>
                        </div>
                    }
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
