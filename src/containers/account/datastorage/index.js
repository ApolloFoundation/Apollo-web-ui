/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {
    getAccountTaggedDataAction,
    getAllTaggedDataAction,
    getDataTagsAction,
    searchTaggedDataAction
} from "../../../actions/datastorage";
import {getTransactionAction} from '../../../actions/transactions/index';
import {setBodyModalParamsAction} from "../../../modules/modals";
import SiteHeader from '../../components/site-header';
import DataStorageItem from "./datastorage-item";
import {Form, Text} from 'react-form';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

import CustomTable from '../../components/tables/table';

const mapStateToProps = state => ({
    account: state.account.account,
    actualBlock: state.account.actualBlock,
});

const mapDispatchToProps = dispatch => ({
    getTransactionAction: (type, data) => dispatch(getTransactionAction(type, data)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    getAllTaggedDataAction: (reqParams) => dispatch(getAllTaggedDataAction(reqParams)),
    getDataTagsAction: (reqParams) => dispatch(getDataTagsAction(reqParams)),
    getAccountTaggedDataAction: (reqParams) => dispatch(getAccountTaggedDataAction(reqParams)),
    searchTaggedDataAction: (reqParams) => dispatch(searchTaggedDataAction(reqParams))
});

class DataStorage extends React.Component {
    state = {
        pageTag: 1,
        itemsPerPage: 32,
        firstIndexTag: 0,
        lastIndexTag: 31,
        dataTags: null,
        taggedData: null,
        page: 1,
        firstIndex: 0,
        lastIndex: 14,
        actualBlock: null,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.actualBlock !== state.actualBlock) {
            return {
                actualBlock: props.actualBlock,
            };
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.actualBlock !== prevState.actualBlock) {
            const pagination = {
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            };
            this.getAllTaggedData(null, pagination);
            this.getDataTags({
                firstIndex: this.state.firstIndexTag,
                lastIndex: this.state.lastIndexTag,
            });
        }
    }

    componentDidMount() {
        this.getAllTaggedData();
        this.getDataTags({
            firstIndex: this.state.firstIndexTag,
            lastIndex: this.state.lastIndexTag,
        });
    }

    getTags = async (reqParams) => {
        const getTags = await this.getDataTags(reqParams);

        if (getTags) {
            this.setState({
                dataTags: getTags
            })
        }
    };

    onPaginateTags = (pageTag) => {
        let reqParams = {
            pageTag: pageTag,
            firstIndex: pageTag * this.state.itemsPerPage - this.state.itemsPerPage,
            lastIndex:  pageTag * this.state.itemsPerPage - 1
        };

        this.setState({...reqParams}, () => {
            this.getTags(reqParams)
        });
    };

    getAllTaggedData = async (query, pagination) => {
        if (!pagination) {
            pagination = {
                page: 1,
                firstIndex: 0,
                lastIndex: 14
            };
        }
        if (!query) {
            query = this.props.match.params.query;
        }
        if (query) {
            query = query.split('=');
            const target = query[0];
            const value = query[1];

            switch (target) {
                case ('tag'):
                    const searchTaggedData = await this.props.searchTaggedDataAction({tag: value, ...pagination});
                    if (searchTaggedData) {
                        this.setState({
                            ...pagination,
                            taggedData: searchTaggedData.data
                        })
                    }
                    return;
                case ('account'):
                    const accountTaggedData = await this.props.getAccountTaggedDataAction({account: value, ...pagination});

                    this.setState({
                        ...pagination,
                        taggedData: accountTaggedData ? accountTaggedData.data : []
                    });

                    return;

                case ('query'):
                    const accountQueryData = await this.props.searchTaggedDataAction({query: value, ...pagination});
                    if (accountQueryData) {
                        this.setState({
                            ...pagination,
                            taggedData: accountQueryData.data
                        })
                    }
                    return;
                default:
                    const allTaggedData = await this.props.getAllTaggedDataAction({...pagination});
                    if (allTaggedData) {
                        this.setState({
                            ...pagination,
                            taggedData: allTaggedData.data
                        })
                    }
                    return;

            }

        } else {
            const allTaggedData = await this.props.getAllTaggedDataAction({...pagination});
            if (allTaggedData) {
                this.setState({
                    ...pagination,
                    taggedData: allTaggedData.data
                })
            }
        }
    };

    getDataTags = async (reqParams) => {
        const allTaggedData = await this.props.getDataTagsAction(reqParams);
        if (allTaggedData) {
            this.setState({
                dataTags: allTaggedData.tags
            })
        }
    };

    getTransaction = async (data) => {
        const reqParams = {
            transaction: data,
            account: this.props.account
        };

        const transaction = await this.props.getTransactionAction(reqParams);

        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }
    };

    handleSearchByAccount = (values) => {
        this.props.history.push('/data-storage/account=' + values.account);
        this.getAllTaggedData('account=' + values.account)
    };

    handleSearchByQuery = (values) => {
        this.props.history.push('/data-storage/query=' + values.query);
        this.getAllTaggedData('query=' + values.query)
    };

    handleSearchByTag = (tag) => {
        this.props.history.push('/data-storage/tag=' + tag);
        this.getAllTaggedData('tag=' + tag)
    };

    storeForm = (field, form) => {
        this.setState({
            [field]: form
        })
    };

    handleReset = async () => {
        const {account, tag} = this.state;

        account.setValue('account', '');
        tag.setValue('query', '');
        await this.props.history.push('/data-storage');
        this.getAllTaggedData('');
    };

    onPaginate = (page) => {
        const pagination = {
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15 - 1
        };
        this.getAllTaggedData(null, pagination);
    };

    render() {
        return (
            <div className="page-content data-storage">
                <SiteHeader
                    pageTitle={'Data Cloud'}
                >
                    <Link
                        to={'/data-storage'}
                        onClick={() => this.handleReset()}
                        className="btn btn-green btn-sm"
                    >
                        Reset
                    </Link>
                </SiteHeader>
                <div className="page-body container-fluid">
                    <div className="data-storage">
                        <div className="row">
                            <div className="col-md-12 p-0">
                                <div className="transactions-filters p-0">
                                    <div className="search-bar row">
                                        <Form
                                            getApi={(value) => this.storeForm('account', value)}
                                            onSubmit={values => this.handleSearchByAccount(values)}
                                            render={({submitForm, setAllValues, setValue}) => {

                                                return (
                                                    <form onSubmit={submitForm}
                                                          className="input-group-app search col-md-3 pl-0">
                                                        <div className="iconned-input-field">
                                                            <Text
                                                                placeholder={'Account ID'}
                                                                defaultValue={
                                                                    this.props.match.params.query && this.props.match.params.query.split('=')[0] === 'account'
                                                                        ? this.props.match.params.query.split('=')[1]
                                                                        : ''
                                                                }
                                                                field={'account'}
                                                                type="text"
                                                            />
                                                            <button
                                                                type={'submit'}
                                                                className="input-icon"
                                                                style={{
                                                                    width: 41
                                                                }}
                                                            >
                                                                <i className="zmdi zmdi-search"/>
                                                            </button>
                                                        </div>
                                                    </form>
                                                )
                                            }}
                                        />
                                        <Form
                                            getApi={(value) => this.storeForm('tag', value)}
                                            onSubmit={values => this.handleSearchByQuery(values)}
                                            render={({submitForm, setAllValues, setValue}) => {

                                                return (
                                                    <form onSubmit={submitForm}
                                                          className="input-group-app search col-md-3 pl-0">
                                                        <div className="iconned-input-field">
                                                            <Text
                                                                placeholder={'Name Description Tag'}
                                                                field={'query'}
                                                                type="text"
                                                            />
                                                            <button
                                                                type={'submit'}
                                                                className="input-icon"
                                                                style={{
                                                                    width: 41
                                                                }}
                                                            >
                                                                <i className="zmdi zmdi-search"/>
                                                            </button>
                                                        </div>
                                                    </form>
                                                )
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="transactions-filters">
                                    <div className={'top-bar'}>
                                        {
                                            this.state.dataTags &&
                                            this.state.dataTags.map((el, index) => {
                                                const params = this.props.match.params.query;
                                                return (
                                                    <div
                                                        onClick={() => this.handleSearchByTag(el.tag)}
                                                        className={classNames({
                                                            'btn filter': true,
                                                            'active': params && params.split('=')[1] === el.tag
                                                        })}
                                                    >
                                                        {el.tag} [{el.count}]
                                                    </div>
                                                );
                                            })
                                        }
                                        {this.state.dataTags && <div
                                            ref={'btnBox'}
                                            className="btn-box pagination"
                                        >
                                            <button
                                                type={'button'}
                                                className={classNames({
                                                    'btn btn-default': true,
                                                    'disabled': this.state.pageTag <= 1,
                                                })}
                                                onClick={this.onPaginateTags.bind(this, this.state.pageTag - 1)}
                                            >
                                                Previous
                                            </button>
                                            <div className='pagination-nav'>
                                                <span>{this.state.pageTag * this.state.itemsPerPage - this.state.itemsPerPage + 1}</span>
                                                <span>&hellip;</span>
                                                <span>{(this.state.pageTag * this.state.itemsPerPage - this.state.itemsPerPage) + this.state.dataTags.length}</span>
                                            </div>
                                            <button
                                                type={'button'}
                                                onClick={this.onPaginateTags.bind(this, this.state.pageTag + 1)}
                                                className={classNames({
                                                    'btn btn-default': true,
                                                    'disabled': this.state.dataTags.length < this.state.itemsPerPage
                                                })}
                                            >
                                                Next
                                            </button>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                            <div className={'pl-0 pr-0 col-md-12 mb-3'}>
                                <CustomTable
                                    header={[
                                        {
                                            name: 'Name',
                                            alignRight: false
                                        }, {
                                            name: 'Account ID',
                                            alignRight: false
                                        }, {
                                            name: 'Mime Type',
                                            alignRight: false
                                        }, {
                                            name: 'Channel',
                                            alignRight: false
                                        }, {
                                            name: 'Filename',
                                            alignRight: false
                                        }, {
                                            name: 'Data',
                                            alignRight: true
                                        }
                                    ]}
                                    emptyMessage={'No tagget data found.'}
                                    TableRowComponent={DataStorageItem}
                                    tableData={this.state.taggedData}
                                    isPaginate
                                    itemsPerPage={15}
                                    page={this.state.page}
                                    previousHendler={() => this.onPaginate(this.state.page - 1)}
                                    nextHendler={() => this.onPaginate(this.state.page + 1)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataStorage);
