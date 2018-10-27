/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {
    getAllTaggedDataAction,
    searchTaggedDataAction,
    getAccountTaggedDataAction,
    getDataTagsAction
} from "../../../actions/datastorage";
import {getTransactionAction} from '../../../actions/transactions/index';
import {setBodyModalParamsAction} from "../../../modules/modals";
import SiteHeader from '../../components/site-header';
import uuid from 'uuid';
import DataStorageItem from "./datastorage-item";
import {Form, Text} from 'react-form';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import {BlockUpdater} from "../../block-subscriber";
import ContentLoader from '../../components/content-loader'
import InfoBox from '../../components/info-box'
import ContentHendler from '../../components/content-hendler'

const mapStateToProps = state => ({
	account: state.account.account,
	state: state
});

const mapDispatchToProps = dispatch => ({
	getTransactionAction: (type, data) => dispatch(getTransactionAction(type, data)),
	setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
	getAllTaggedDataAction: (reqParams) => dispatch(getAllTaggedDataAction(reqParams)),
	getDataTagsAction: (reqParams) => dispatch(getDataTagsAction(reqParams)),
	getAccountTaggedDataAction: (reqParams) => dispatch(getAccountTaggedDataAction(reqParams)),
	searchTaggedDataAction: (reqParams) => dispatch(searchTaggedDataAction(reqParams))
});

class DataStorage extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		dataTags: null,
		taggedData: null

	};

	listener = data => {
        this.getAllTaggedData(this.props);
        this.getDataTags();
    };

    componentDidMount() {
        this.getAllTaggedData();
        this.getDataTags();
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener);
    }

	componentWillReceiveProps(newState) {
		this.getAllTaggedData(newState);
		this.getDataTags();
	}

	getAllTaggedData = async (newState) => {
		let query;

		if (newState) {
			query = newState.match.params.query;
		} else {
			query = this.props.match.params.query;

		}


		if (query) {
			query = query.split('=');

			const target = query[0];
			const value = query[1];

			switch (target) {
				case('tag'):
					const searchTaggedData = await this.props.searchTaggedDataAction({tag: value});
					if (searchTaggedData) {
						this.setState({
							...this.state,
							taggedData: searchTaggedData.data
						})
					}
					return;
				case('account'):
					const accountTaggedData = await this.props.getAccountTaggedDataAction({account: value});

                    this.setState({
                        ...this.state,
                        taggedData: accountTaggedData ? accountTaggedData.data : []
                    });

					return;

				case('query'):
					const accountQueryData = await this.props.searchTaggedDataAction({query: value});
					if (accountQueryData) {
						this.setState({
							...this.state,
							taggedData: accountQueryData.data
						})
					}
					return;
				default:
					const allTaggedData = await this.props.getAllTaggedDataAction();
					if (allTaggedData) {
						this.setState({
							...this.state,
							taggedData: allTaggedData.data
						})
					}
					return;

			}

		} else {
			const allTaggedData = await this.props.getAllTaggedDataAction();
			if (allTaggedData) {
				this.setState({
					...this.state,
					taggedData: allTaggedData.data
				})
			}
		}
	};

	getDataTags = async (reqParams) => {
		const allTaggedData = await this.props.getDataTagsAction(reqParams);
		if (allTaggedData) {
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

		if (transaction) {
			this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
		}
	};

	handleSearchByAccount = (values) => {
		this.props.history.push('/data-storage/account=' + values.account);
	};

	handleSearchByQuery = (values) => {
		this.props.history.push('/data-storage/query=' + values.query);
	};

	handleSearchByTag = () => {

	};

	render() {
		return (
			<div className="page-content data-storage">
				<SiteHeader
					pageTitle={'Data Cloud'}
				>
					<Link
						to={'/data-storage'}
						className="btn primary"
					>
						Reset
					</Link>
				</SiteHeader>
				<div className="page-body container-fluid">
					<div className="data-storage">
						<div className="row">
							<div className="col-md-12">
								<div className="transactions-filters align-for-inputs">
									<div className="search-bar">
										<Form
											onSubmit={values => this.handleSearchByAccount(values)}
											render={({submitForm, setAllValues, setValue}) => {

												return (
													<form onSubmit={submitForm} className="input-group-app search">
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
											onSubmit={values => this.handleSearchByQuery(values)}
											render={({submitForm, setAllValues, setValue}) => {

												return (
													<form onSubmit={submitForm} className="input-group-app search">
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
									<div className="tags">

									</div>
								</div>
								<div
									className="transactions-filters align-for-inputs"
									style={{
										paddingBottom: 0,
                                        display: 'block'
                                    }}
                                >
                                    {
                                        this.state.dataTags &&
                                        this.state.dataTags.map((el, index) => {
                                            const params = this.props.match.params.query;

                                            return (
                                                <Link
                                                    key={uuid()}
                                                    to={'/data-storage/tag=' + el.tag}
                                                    className={classNames({
                                                        'btn': true,
                                                        'btn-primary': true,
                                                        'gray-lighten': !params || (params && params.split('=')[1] !== el.tag),
                                                        'static': true,
                                                        'blue': params && params.split('=')[1] === el.tag
                                                    })}
                                                    style={{
                                                        marginRight: 20,
														marginBottom: 20
                                                    }}
                                                >
                                                    {el.tag} [{el.count}]
                                                </Link>
                                            );
                                        })
                                    }

                                </div>
                            </div>
                        </div>
						{
							this.state.taggedData &&
							!!this.state.taggedData.length &&
                            <div className="transaction-table">
                                <div className="transaction-table-body">
                                    <table>
                                        <thead>
                                        <tr>
                                            <td>Name</td>
                                            <td>Account ID</td>
                                            <td>Mime Type</td>
                                            <td>Channel</td>
                                            <td>Filename</td>
                                            <td className="align-right">Data</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.taggedData &&
                                            this.state.taggedData.map((el, index) => {
                                                return (
                                                    <DataStorageItem
                                                        key={uuid()}
                                                        {...el}
                                                        getTransaction={this.getTransaction}
                                                    />
                                                );
                                            })
                                        }
                                        </tbody>
                                    </table>
									{/*{*/}
										{/*this.state.taggedData &&*/}
										{/*this.state.taggedData.length &&*/}
                                        {/*<div className="btn-box">*/}
                                            {/*<a*/}
                                                {/*className={classNames({*/}
                                                    {/*'btn' : true,*/}
                                                    {/*'btn-left' : true,*/}
                                                    {/*'disabled' : this.state.page <= 1*/}
                                                {/*})}*/}
                                                {/*onClick={() => this.onPaginate(this.state.page - 1)}*/}
                                            {/*> Previous</a>*/}
                                            {/*<div className='pagination-nav'>*/}
                                                {/*<span>{this.state.firstIndex + 1}</span>*/}
                                                {/*<span>&hellip;</span>*/}
                                                {/*<span>{this.state.lastIndex + 1}</span>*/}
                                            {/*</div>*/}
                                            {/*<a*/}
                                                {/*onClick={() => this.onPaginate(this.state.page + 1)}*/}
                                                {/*className={classNames({*/}
                                                    {/*'btn' : true,*/}
                                                    {/*'btn-right' : true,*/}
                                                    {/*'disabled' : this.state.taggedData.length < 15*/}
                                                {/*})}*/}
                                            {/*>Next</a>*/}
                                        {/*</div>*/}
									{/*}*/}

                                </div>
                            </div>
                        }
						{
							this.state.taggedData &&
							!this.state.taggedData.length &&
								<InfoBox default>
									No tagged data found.
								</InfoBox>
						}
						{
                            !this.state.taggedData &&
							<ContentLoader />
						}

                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataStorage);