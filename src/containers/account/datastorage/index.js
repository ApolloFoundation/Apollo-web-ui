import React from 'react';
import {connect} from 'react-redux';
import {getAllTaggedDataAction, getDataTagsAction} from "../../../actions/datastorage";
import {getTransactionAction} from '../../../actions/transactions/index';
import {setBodyModalParamsAction} from "../../../modules/modals";
import SiteHeader from '../../components/site-header';
import uuid from 'uuid';
import DataStorageItem from "./datastorage-item";
import classNames from 'classnames';

const mapStateToProps = state => ({
    account: state.account.account,
    state: state
})

const mapDispatchToProps = dispatch => ({
    getTransactionAction: (type, data) => dispatch(getTransactionAction(type, data)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getAllTaggedDataAction: (reqParams) => dispatch(getAllTaggedDataAction(reqParams)),
    getDataTagsAction: (reqParams) => dispatch(getDataTagsAction(reqParams))
});

@connect(mapStateToProps, mapDispatchToProps)
class DataStorage extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        dataTags: null,
        taggedData: null

    };

    componentDidMount() {
        this.getAllTaggedData();
        this.getDataTags();
    }

    componentWillReceiveProps(newState) {
        this.getAllTaggedData();
        this.getDataTags();

        console.log(newState);
    }

    getAllTaggedData = async (reqParams) => {
        const allTaggedData = await this.props.getAllTaggedDataAction(reqParams);
        console.log(allTaggedData);

        if (allTaggedData) {
            console.log(allTaggedData);
            this.setState({
                ...this.state,
                taggedData: allTaggedData.data
            })
        }
    };

    getDataTags = async (reqParams) => {
        const allTaggedData = await this.props.getDataTagsAction(reqParams);
        console.log(allTaggedData);

        if (allTaggedData) {
            console.log(allTaggedData);
            this.setState({
                ...this.state,
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

        console.log(transaction);

        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }
    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Data Cloud'}
                >

                </SiteHeader>
                <div className="page-body container-fluid">
                    <div className="data-storage">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="transactions-filters align-for-inputs">
                                    <div className="search-bar">
                                        <span>
                                            <div className="input-group search">
                                                <input type="text"/>
                                                <div
                                                    className="input-icon"
                                                    style={{
                                                        width: 41
                                                    }}
                                                >
                                                    <i className="zmdi zmdi-search"></i>
                                                </div>
                                            </div>
                                        </span>
                                        <span style={{
                                            marginLeft: 20
                                        }}>
                                            <div className="input-group search">
                                                <input type="text"/>
                                                <div
                                                    className="input-icon"
                                                    style={{
                                                        width: 41
                                                    }}
                                                >
                                                    <i className="zmdi zmdi-search"></i>
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                    <div className="tags">

                                    </div>
                                </div>
                                <div
                                    className="transactions-filters align-for-inputs"
                                    style={{
                                        marginBottom: 24,
                                        display: 'block'
                                    }}
                                >
                                    {
                                        this.state.dataTags &&
                                            this.state.dataTags.map((el, index) => {
                                                return (
                                                    <button
                                                        className="btn btn-primary gray-lighten static"
                                                        style={{
                                                            marginRight: 20
                                                        }}
                                                    >
                                                        {el.tag} [{el.count}]
                                                    </button>
                                                );
                                            })
                                    }

                                </div>
                            </div>
                        </div>
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Name</td>
                                        <td>Account</td>
                                        <td className="align-right">Mime Type</td>
                                        <td>Channel</td>
                                        <td>Filename</td>
                                        <td className="align-right">Data</td>
                                    </tr>
                                    </thead>
                                    <tbody key={uuid()}>
                                    {
                                        this.state.taggedData &&
                                        this.state.taggedData.map((el, index) => {
                                            return (
                                                <DataStorageItem
                                                    {...el}
                                                    getTransaction={this.getTransaction}
                                                />
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                                {/*<div className="btn-box">*/}
                                    {/*<a*/}
                                        {/*className={classNames({*/}
                                            {/*'btn' : true,*/}
                                            {/*'btn-left' : true,*/}
                                            {/*'disabled' : this.state.page <= 1*/}
                                        {/*})}*/}
                                        {/*onClick={this.onPaginate.bind(this, this.state.page - 1)}*/}
                                    {/*> Previous</a>*/}
                                    {/*<div className='pagination-nav'>*/}
                                        {/*<span>{this.state.firstIndex + 1}</span>*/}
                                        {/*<span>&hellip;</span>*/}
                                        {/*<span>{this.state.lastIndex + 1}</span>*/}
                                    {/*</div>*/}
                                    {/*<a*/}
                                        {/*onClick={this.onPaginate.bind(this, this.state.page + 1)}*/}
                                        {/*className={classNames({*/}
                                            {/*'btn' : true,*/}
                                            {/*'btn-right' : true,*/}
                                            {/*'disabled' : this.state.ledger.length < 15*/}
                                        {/*})}*/}
                                    {/*>Next</a>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DataStorage;