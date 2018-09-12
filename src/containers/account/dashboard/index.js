import React from 'react';
import SiteHeader from '../../components/site-header'
import CircleFigure from './circle-figure'
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {setBodyModalParamsAction, setMopalType} from '../../../modules/modals';
import classNames from "classnames";
import Transaction from './transaction';

import {formatTimestamp} from "../../../helpers/util/time";
import {getBlockAction} from "../../../actions/blocks";
import {getTransactionsAction} from "../../../actions/transactions";
import {getAccountCurrenciesAction} from "../../../actions/currencies";
import {
	getDGSGoodsCountAction,
	getDGSPurchaseCountAction,
	getDGSPurchasesAction,
	getDGSPendingPurchases
} from "../../../actions/marketplace";
import {getAccountAssetsAction} from '../../../actions/assets'
import {getAliasesCountAction} from '../../../actions/aliases'
import {getMessages} from "../../../actions/messager";
import {getNewsAction} from "../../../actions/account";


const mapStateToProps = state => ({
	account: state.account.account,
	accountRS: state.account.accountRS,
	balanceATM: state.account.balanceATM,
	description: state.account.description,
	forgedBalanceATM: state.account.forgedBalanceATM,
	name: state.account.name,
	publicKey: state.account.publicKey,
	requestProcessingTime: state.account.requestProcessingTime,
	unconfirmedBalanceATM: state.account.unconfirmedBalanceATM,
	assets: state.account.assetBalances,
	blockchainStatus: state.account.blockchainStatus
});

const mapDispatchToProps = dispatch => ({

    getMessages: (reqParams) => dispatch(getMessages(reqParams)),
    getNewsAction: () => dispatch(getNewsAction()),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    setMopalType: (type) => dispatch(setMopalType(type)),
    formatTimestamp: (timestamp) => dispatch(formatTimestamp(timestamp)),
    getBlockAction: (reqParams) => dispatch(getBlockAction(reqParams)),
    getDGSGoodsCountAction: (reqParams) => dispatch(getDGSGoodsCountAction(reqParams)),
    getDGSPendingPurchases: (reqParams) => dispatch(getDGSPendingPurchases(reqParams)),
    getDGSPurchasesAction: (reqParams) => dispatch(getDGSPurchasesAction(reqParams)),
    getAccountAssetsAction: (requestParams) => dispatch(getAccountAssetsAction(requestParams)),
    getAliasesCountAction: (requestParams) => dispatch(getAliasesCountAction(requestParams)),
    getAccountCurrenciesAction: (requestParams) => dispatch(getAccountCurrenciesAction(requestParams)),
    getDGSPurchaseCountAction: (requestParams) => dispatch(getDGSPurchaseCountAction(requestParams)),
    getTransactionsAction: (requestParams) => dispatch(getTransactionsAction(requestParams)),
});

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		assetsValue: null,
		aliassesValue: null,
		transactions: null,
		firstIndex: 0,
		lastIndex: 14,
		newsItem: 0
	};

	componentWillReceiveProps(newState) {
		this.getBlock();
		if (newState.account) {
			this.initDashboard({account: newState.account})
		}
	}


    componentWillMount() {
        this.getBlock();
        if (this.props.account) {
            this.initDashboard({account: this.props.account})
        }
        this.getNews();
    }

	initDashboard = (reqParams) => {
		this.getAccountAsset(reqParams);
		this.getAliasesCount(reqParams);
		this.getCurrenciesCount(reqParams);
		this.getMessagesCount(reqParams);
		this.getGoods({...reqParams, seller: this.props.account});
		this.getTransactions({
			...reqParams,
			firstIndex: this.state.firstIndex,
			lastIndex: this.state.lastIndex
		});

	};

	getAccountAsset = async (requsetParams) => {
		const accountAssets = await this.props.getAccountAssetsAction(requsetParams);

        if (accountAssets) {
            this.setState({
                assetData: accountAssets.accountAssets,
                assetsValue: parseInt(accountAssets.accountAssets
					.map((el) => {
						if(el.decimals) {
                    		return parseInt(el.quantityATU / Math.pow(10, el.decimals))
						} else {
                            return parseInt(el.quantityATU)
						}
					}).reduce((a, b) => a + b, 0)),
                assetsCount: accountAssets.accountAssets.length
            })
        }
    };

	getAliasesCount = async (requsetParams) => {
		const aliasesCount = await this.props.getAliasesCountAction(requsetParams);

		if (aliasesCount) {
			this.setState({
				aliassesValue: aliasesCount.numberOfAliases
			})
		}
	};

	getCurrenciesCount = async (requsetParams) => {
		const currencies = await this.props.getAccountCurrenciesAction(requsetParams);

		if (currencies) {
			this.setState({
				currenciesValue: (currencies.accountCurrencies && currencies.accountCurrencies.length && parseInt(currencies.accountCurrencies.map((el) => {
					return el.utils
				}).reduce((a, b) => a + b, 0))) || parseInt(0),
				currenciesCount: currencies.accountCurrencies.length
			})
		}
	};

	getMessagesCount = async (reqParams) => {
		const messages = await this.props.getMessages(reqParams);

		if (messages) {
			this.setState({
				messages: messages.transactions.length
			})
		}
	};

	getTransactions = async (reqParams) => {
		const transactions = await this.props.getTransactionsAction(reqParams);

		if (transactions) {
			this.setState({
				transactions: transactions.transactions
			})
		}
	};

	getBlock = async (reqParams) => {
		const block = await this.props.getBlockAction(reqParams);
		if (block) {
			this.setState({
				block: block
			})
		}
	};

	getGoods = async (reqParams) => {
		const purchased = await this.props.getDGSPurchaseCountAction(reqParams);
		const pendingGoods = await this.props.getDGSPendingPurchases(reqParams);
		const completedPurchased = await this.props.getDGSPurchaseCountAction(reqParams);


        if (purchased && completedPurchased && pendingGoods) {
            this.setState({
                numberOfGoods: purchased.numberOfPurchases,
                completedGoods: completedPurchased.numberOfPurchases,
                pendingGoods: pendingGoods.purchases.length,
            })
        }
    };

	getNews = async () => {
		const news = await this.props.getNewsAction();

        if (news) {
			this.setState({
				news,
				newsCount: news.tweets.length
			})
		}
	};

	getNewsItem = (tweet) => {
        let itemContent = '';
        const post = tweet.retweeted_status ? tweet.retweeted_status : tweet;
        const dateArr = post.created_at.split(" ");
        const media = (post.extended_entities && post.extended_entities.media.length > 0) ?
            post.extended_entities.media[0].media_url : false;
        itemContent += `<div class='post-title'>@${post.user.screen_name}<span class='post-date'>${dateArr[1]} ${dateArr[2]}</span></div>`;
        itemContent += `<div class='post-content'>${post.full_text}</div>`;
        if (media) itemContent += `<div class='post-image' style="background-image: url('${media}')"></div>`;
        return <a className="post-item" href={`https://twitter.com/${post.user.screen_name}/status/${post.id_str}`}
                  target="_blank" dangerouslySetInnerHTML={{__html: itemContent}} rel="noopener noreferrer"/>;
	};

	render() {
		return (
			<div className="page-content">
				<SiteHeader
					pageTitle={'Dashboard'}
					dashboardPage
				/>
				<div className="page-body container-fluid full-screen-block no-padding-on-the-sides">
					<div className={"page-body-top-bottom-container"}>
						<div className="page-body-top">
							<div className="page-body-item ">
								<div className="card header ballance chart-sprite position-1">
									<div className="card-title">Available Balance</div>
									<div className="amount">
										{Math.round(this.props.balanceATM / 100000000).toLocaleString('en')}
										<div className="owned">
											APL <span>Owned</span>
										</div>
									</div>
									<div className="account-sub-titles">
										{this.props.accountRS}
									</div>

									{
										this.state.block &&
										<div className="account-sub-titles">
											Block:&nbsp;{this.state.block.height}&nbsp;/&nbsp;{this.props.formatTimestamp(this.state.block.timestamp)}
										</div>
									}
									<button
										className="btn btn-right gray round round-bottom-right round-top-left absolute"
										data-modal="sendMoney"
									>
										Buy/sell&nbsp;
										<i className="arrow zmdi zmdi-chevron-right"/>
									</button>
								</div>
							</div>
							<div className="page-body-item ">
								<div className="card header assets chart-sprite position-2">
									<div className="card-title">Assets Value</div>
									<div className="amount">
										<div className="text">
											{Math.round(this.state.assetsValue).toLocaleString('en')}
										</div>
										{
											Math.round(this.state.assetsValue) > 100000000000 &&
											<div className="amount-tooltip">
												<div className="amount-tooltip-text">
													{Math.round(this.state.assetsValue).toLocaleString('en')}
												</div>
											</div>
										}
										<div className="owned">
											{this.state.assetsCount} <span>Owned</span>
										</div>
									</div>
								</div>
							</div>
							<div className="page-body-item ">
								<div className="card header currencies chart-sprite position-3">
									<div className="card-title">Currencies Value</div>
									<div className="amount">
										{Math.round(this.state.currenciesValue / 100000000).toLocaleString('en')}
										<div className="owned">
											{this.state.currenciesCount} <span>Owned</span>
										</div>
									</div>
								</div>
							</div>
							<div className="page-body-item ">
								<div className="card header coins flex chart-sprite position-4">
									<div className="general-info">
										<div className="general-info-item top-left">
											<div className="top-bar">
												{this.state.messages}
											</div>
											<div className="bottom-bar">
												Secure
												messages
											</div>
										</div>
										<div className="general-info-item top-right">
											<div className="top-bar">
												11
											</div>
											<div className="bottom-bar">
												Coin
												shuffling
											</div>
										</div>
										<div className="general-info-item bottom-left">
											<div className="top-bar">
												1
											</div>
											<div className="bottom-bar">
												Secure
												aliases
											</div>
										</div>
										<div className="general-info-item bottom-right">
											<div className="top-bar">
												22
											</div>
											<div className="bottom-bar">
												Data
												storage
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="page-body-bottom">
							<div className="page-body-item ">
								<div className="card card-tall transactions">
									<div className="card-title">Transactions</div>
									<div className="transactions-dashboard scroll">
										{
											this.state.transactions &&
											this.state.transactions.map((el, index) => {
												return (
													<Transaction {...el}/>
												);
											})
										}
									</div>
								</div>
							</div>
							<div className="page-body-item ">
								<div className="card asset-portfolio">
									<div className="card-title">Asset Portfolio</div>
									<div className="full-box">
										{
											this.state.assetData &&
											this.state.assetData.map((el, index) => {
												if (index < 3) {
													return (
														<div className="full-box-item coin">
															<div className="coin-data">
																<CircleFigure
																	index={index}
																	percentage={(el.quantityATU) / this.props.assets.map((el, index) => {
																		return parseInt(el.balanceATU)
																	}).reduce((a, b) => a + b, 0) * 100}
																	type={el.quantityATU}
																/>
																<div
																	className="amount">{Math.round((el.quantityATU) / this.props.assets.map((el, index) => {
																	return parseInt(el.balanceATU)
																}).reduce((a, b) => a + b, 0) * 100)}%
																</div>
																<div className="coin-name">{el.name}</div>
																<Link
																	to={'/asset-exchange/' + el.asset}
																	className="more"
																>
																	<i className="zmdi zmdi-more"/>
																</Link>
															</div>
														</div>
													);
												}
											})
										}
									</div>
								</div>
								<div className="card decentralized-marketplace">
									<div className="card-title">Decentralized Marketplace</div>
									<div className="full-box">
										<div className="full-box-item">
											<div className="marketplace-box">
												<div className="digit">{this.state.numberOfGoods}</div>
												<div className="subtitle">Purchased products</div>
											</div>
											<div className="marketplace-box">
												<div
													className="digit">{this.state.pendingGoods}/{this.state.completedGoods}</div>
												<div className="subtitle">Sales</div>
											</div>
										</div>
									</div>
									<Link to="/marketplace" className="btn btn-left btn-simple">Marketplace</Link>
									<button
										className="btn btn-right gray round round-bottom-right round-top-left absolute"
										data-modal="sendMoney"
									>
										Buy/sell&nbsp;
										<i className="arrow zmdi zmdi-chevron-right"/>
									</button>
								</div>
							</div>
							<div className="page-body-item ">
								<div className="card send-apollo">
									<div className="card-title">Send Apollo</div>
									<div className="full-box">
										<div className="form-group-app offset">
											<div className="input-group-app lighten">
												<label>Recipient</label>
												<input placeholder={'Account RS'} ref={'recipient'} type="text"/>
											</div>
											<div className="input-group-app lighten">
												<label>Amount</label>
												<input placeholder={'Amount'} ref={'amountATM'} type={'number'}/>
											</div>
											<div className="input-group-app lighten">
												<label>Fee</label>
												<input placeholder={'Amount'} ref={'feeATM'}  type={'number'}/>
											</div>
										</div>
									</div>
									<a onClick={this.props.setMopalType.bind(this, 'SEND_APOLLO_PRIVATE')}
									   className="btn btn-left btn-simple">Private APL</a>
									<button
										className="btn btn-right gray round round-bottom-right round-top-left absolute"
										data-modal="sendMoney"
										onClick={() => this.props.setBodyModalParamsAction('SEND_APOLLO', {recipient: this.refs.recipient.value, amountATM: this.refs.amountATM.value, feeATM: this.refs.feeATM.value})}
									>
										Send&nbsp;
										<i className="arrow zmdi zmdi-chevron-right"/>
									</button>
								</div>
								<div className="card active-polls">
									<div className="card-title">Active Polls</div>
									<div className="full-box block">
										<p>Search for Zerp on the Asset Exchange section.</p>
										<p>What features should be implemented in apollo platform?</p>
										<p>Apollo to have future USD/Fiat Pairs on Exchange?</p>
									</div>
									<button
										className="btn btn-right gray round round-bottom-right round-top-left absolute "
										data-modal="sendMoney"
										onClick={this.props.setMopalType.bind(this, 'ISSUE_POLL')}
									>
										Create poll&nbsp;
										<i className="arrow zmdi zmdi-chevron-right"/>
									</button>
								</div>
							</div>
							<div className="page-body-item ">
								<div className="card card-tall apollo-news">
									<div className="card-title">Apollo News</div>
									<div className="card-news-content">
										{this.state.news && this.getNewsItem(this.state.news.tweets[this.state.newsItem])}
									</div>

                                    <button
                                        className={classNames({
                                            'btn': true,
                                            'btn-left': true,
                                            'gray': true,
                                            'round': true,
                                            'round-top-right': true,
                                            'round-bottom-left': true,
                                            'absolute': true,
                                            'disabled': this.state.newsItem === 0
                                        })}
                                        data-modal="sendMoney"
										onClick={() => {this.setState({newsItem: this.state.newsItem - 1})}}
                                    >
                                        <i className="arrow zmdi zmdi-chevron-left" />&nbsp;
                                        Previous
                                    </button>
									{
                                        this.state.newsCount &&
                                        <button
                                            className={classNames({
												'btn': true,
												'btn-right': true,
												'gray': true,
												'round': true,
												'round-bottom-right': true,
												'round-top-left': true,
												'absolute': true,
												'disabled': this.state.newsItem === this.state.newsCount - 1
											})}
                                            data-modal="sendMoney"
                                            onClick={() => {this.setState({newsItem: this.state.newsItem + 1})}}
                                        >
                                            Next&nbsp;
                                            <i className="arrow zmdi zmdi-chevron-right" />
                                        </button>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
