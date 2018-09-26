import React from 'react';
import SiteHeader from '../../components/site-header'
import CircleFigure from './circle-figure'
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {setBodyModalParamsAction, setMopalType} from '../../../modules/modals';
import classNames from "classnames";
import Transaction from './transaction';

import uuid from 'uuid';
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
import {getAccountAssetsAction, getSpecificAccountAssetsAction} from '../../../actions/assets'
import {getAliasesCountAction} from '../../../actions/aliases'
import {getMessages} from "../../../actions/messager";
import {getNewsAction} from "../../../actions/account";
import {BlockUpdater} from "../../block-subscriber/index";
import {reloadAccountAction} from "../../../actions/login";
import {getAllTaggedDataAction} from "../../../actions/datastorage";
import {getActiveShfflings, getShufflingAction} from "../../../actions/shuffling";
import {getpollsAction} from "../../../actions/polls";
import {getAccountInfoAction} from "../../../actions/account";

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
	reloadAccount: acc => dispatch(reloadAccountAction(acc)),
    getAccountInfo: reqParams => dispatch(getAccountInfoAction(reqParams)),
	getMessages: (reqParams) => dispatch(getMessages(reqParams)),
	getNewsAction: () => dispatch(getNewsAction()),
	setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
	setMopalType: (type) => dispatch(setMopalType(type)),
	formatTimestamp: (timestamp) => dispatch(formatTimestamp(timestamp)),
    getpollsAction: (reqParams) => dispatch(getpollsAction(reqParams)),
    getBlockAction: (reqParams) => dispatch(getBlockAction(reqParams)),
	getDGSGoodsCountAction: (reqParams) => dispatch(getDGSGoodsCountAction(reqParams)),
	getDGSPendingPurchases: (reqParams) => dispatch(getDGSPendingPurchases(reqParams)),
	getDGSPurchasesAction: (reqParams) => dispatch(getDGSPurchasesAction(reqParams)),
	getAccountAssetsAction: (requestParams) => dispatch(getAccountAssetsAction(requestParams)),
	getAliasesCountAction: (requestParams) => dispatch(getAliasesCountAction(requestParams)),
	getAccountCurrenciesAction: (requestParams) => dispatch(getAccountCurrenciesAction(requestParams)),
	getDGSPurchaseCountAction: (requestParams) => dispatch(getDGSPurchaseCountAction(requestParams)),
	getTransactionsAction: (requestParams) => dispatch(getTransactionsAction(requestParams)),
    getActiveShfflings  : (reqParams) => dispatch(getActiveShfflings(reqParams)),
    getAllTaggedDataAction: (reqParams) => dispatch(getAllTaggedDataAction(reqParams)),
	getAssetAction: (reqParams) => dispatch(getSpecificAccountAssetsAction(reqParams))

});

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			positionState1: false,
			positionState2: false,
			positionState3: false,
			assetsValue: null,
			aliassesValue: null,
			transactions: null,
            taggedData: null,
			firstIndex: 0,
			lastIndex: 14,
			newsItem: 0
		};
		this.position1 = this.position1.bind(this);
		this.position2 = this.position2.bind(this);
		this.position3 = this.position3.bind(this);
	}

	position1() {
		this.setState({positionState1: !this.state.positionState1});
	}

	position2() {
		this.setState({positionState2: !this.state.positionState2});
	}

	position3() {
		this.setState({positionState3: !this.state.positionState3});
	}

	listener = data => {
		this.initDashboard({account: this.props.account});
		// this.props.reloadAccount(this.props.accountRS);
	};

	componentDidMount() {
		BlockUpdater.on("data", this.listener);
    }

	dashBoardinterval = setInterval(() => {
        this.getTransactions({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        })
    }, 2000)

	componentWillUnmount() {
		BlockUpdater.removeListener("data", this.listener);
        clearInterval(this.dashBoardinterval);
	}

	componentWillReceiveProps(newState) {
		this.getBlock();
		if (newState.account) {
			this.initDashboard({account: newState.account})
		}
	}

    getAccountInfo = async (reqParams) => {
		const accountInfo = await this.props.getAccountInfo(reqParams);

		if (accountInfo) {
			this.setState({
                accountInfo
			})
		} else {
            this.setState({
                accountInfo: {
                    balanceATM: 0,
                    accountRS: this.props.accountRS,
				}
            })
		}
	};

	componentWillMount(newState) {
		this.getBlock();
		if (this.props.account) {
			this.initDashboard({account: this.props.account})
		}
        this.getAssets(newState);
        this.getNews();
	}

	initDashboard = (reqParams) => {
		this.getAllTaggedData(reqParams);
		this.getAccountAsset(reqParams);
		// this.getAliasesCount(reqParams);
		this.getCurrenciesCount(reqParams);
		this.getMessagesCount(reqParams);
		this.getActivePolls(reqParams);
		this.getShufflingAction(reqParams);
		this.getAssets(this.props);
        this.getAccountInfo(reqParams);
		this.getGoods({...reqParams, seller: this.props.account});
		this.getTransactions({
			...reqParams,
			firstIndex: this.state.firstIndex,
			lastIndex: this.state.lastIndex
		});
	};

	getActivePolls = async (reqParams) => {

        reqParams = {
            ...reqParams,
            includeFinished: false,
        };

		const polls = await this.props.getpollsAction(reqParams);

		if (polls) {
			this.setState({
                polls: polls.polls.splice(0,3)
			})
		}
	};

    getAllTaggedData = async (requsetParams) => {
    	const taggedData = await this.props.getAllTaggedDataAction(requsetParams);

    	if (taggedData) {
			this.setState({
                taggedData: taggedData.data.length
			})
		}
	};

    getShufflingAction = async (reqParams) => {
    	const shuffling = await this.props.getActiveShfflings(reqParams);

    	if (shuffling) {
            this.setState({
                shuffling: shuffling.shufflings.length
            })
		}
	};

	getAccountAsset = async (requsetParams) => {
		const accountAssets = await this.props.getAccountAssetsAction(requsetParams);

		if (accountAssets) {

			this.setState({
				assetData: accountAssets.accountAssets,
				assetsCount: accountAssets.accountAssets.length
			})
		}
	};

    getAssets = async (newState) => {
		let assets = await this.props.getAssetAction({
			account: this.props.account
		});
		if (assets) {
			const accountAssets = assets.accountAssets;
			const assetsInfo    = assets.assets;


			const result = accountAssets.map((el, index) => {
				return {...(assetsInfo[index]), ...el}
			});

            let assetsCountValue;

            if (!!result.length) {
                assetsCountValue = (result.map((el) => {return Number(el.quantityATU / Math.pow(10, el.decimals))})).reduce((a, b) => {return a + b});
			} else {
                assetsCountValue = 0;
			}

            this.setState({
				dashboardAssets: result.splice(0,3),
                assetsValue: assetsCountValue
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
            let currenciesValue;

            if (!!currencies.accountCurrencies.length) {
                currenciesValue = (
                    currencies.accountCurrencies.map((el) => {
                        return parseInt(el.units) / Math.pow(10, el.decimals)})
                ).reduce((a, b) => {return a + b});
			} else {
                currenciesValue = 0
			}

            this.setState({
				currenciesValue: currenciesValue,
				currenciesCount: currencies.accountCurrencies.length
			})
		}
	};

	getMessagesCount = async (reqParams) => {
        const messages = await this.props.getMessages(reqParams);

        if (messages) {
			this.setState({
				messages: messages.transactions
			})
		}
	};

	getTransactions = async (reqParams) => {
		const transactions = await this.props.getTransactionsAction(reqParams);

        const unconfirmedTransactions = await this.props.getTransactionsAction({requestType: 'getUnconfirmedTransactions', account: this.props.account});

        if (transactions && unconfirmedTransactions) {
			this.setState({
				...this.state,
				transactions: [ ...unconfirmedTransactions.unconfirmedTransactions, ...transactions.transactions]
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


		const numberOfGoods = await this.props.getDGSPurchaseCountAction({...reqParams, requestType: 'getDGSGoodsCount'});

        reqParams.buyer = reqParams.account;
        delete reqParams.account;
        delete reqParams.seller;

		const proedeductsForSale = await this.props.getDGSPurchaseCountAction({...reqParams , requestType: 'getDGSPurchases'});

        if (proedeductsForSale && purchased && completedPurchased && pendingGoods) {
			this.setState({
				numberOfGoods: proedeductsForSale.purchases.length,
				completedGoods: numberOfGoods.numberOfGoods,
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
						<div className="page-body-top" key={uuid()}>
							<div className="page-body-item ">
								<div
									className={`card header ballance chart-sprite position-1 ${this.state.positionState1 ? "show-hide-content" : ""}`}>
									<div className="card-title">Available Balance</div>
									<div className="arrow-block" onClick={this.position1}>
										<div className="arrow"/>
									</div>
									<div className="page-body-item-content">

										<div
                                            onClick={() => this.props.setBodyModalParamsAction('ACCOUNT_DETAILS')}
											style={{cursor: 'pointer'}}
											className="amount"
										>
											{this.state.accountInfo && Math.round(this.state.accountInfo.balanceATM / 100000000).toLocaleString('en')}
											<span className="currency">
												&nbsp;APL
											</span>
										</div>
										<div className="account-sub-titles">
											{this.state.accountInfo && this.state.accountInfo.accountRS}
										</div>

										{
											this.state.block &&
											<div className="account-sub-titles">
												Block:&nbsp;{this.state.block.height}&nbsp;/&nbsp;{this.props.formatTimestamp(this.state.block.timestamp)}
											</div>
										}
									</div>
								</div>
							</div>
							<div className="page-body-item ">
								<div
									className={`card header assets chart-sprite position-2 ${this.state.positionState2 ? "show-hide-content" : ""}`}>
									<div className="arrow-block" onClick={this.position2}>
										<div className="arrow"/>
									</div>
									<div className="card-title">Assets Value</div>
									<div className="page-body-item-content">
										<Link
											to={'/my-assets'}
											style={{display: 'block'}}
											className="amount"
										>
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
										</Link>
									</div>
								</div>
							</div>
							<div className="page-body-item ">
								<div
									className={`card header currencies chart-sprite position-3 ${this.state.positionState3 ? "show-hide-content" : ""}`}>
									<div className="arrow-block" onClick={this.position3}>
										<div className="arrow"/>
									</div>
									<div className="card-title">Currencies Value</div>
									<div className="page-body-item-content">
										<Link
											className="amount"
                                            to={'/my-currencies'}
                                            style={{display: 'block'}}
										>
											{this.state.currenciesValue && Math.round(this.state.currenciesValue).toLocaleString('en')}
											<div className="owned">
												{this.state.currenciesCount} <span>Owned</span>
											</div>
										</Link>
									</div>
								</div>
							</div>
							<div className="page-body-item ">
								<div className="card header header-values coins flex chart-sprite position-4">
									<div className="general-info">
										<Link
											to={'/messenger'}
											className="general-info-item top-left"
										>
											<div className="top-bar">
												{
													!!this.state.messages &&
													this.state.messages.length
												}
												{
													!!this.state.messages &&
                                                	this.state.messages.length === 100 &&
														'+'
												}
											</div>
											<div className="bottom-bar">
												Secure
												messages
											</div>
										</Link>
										<Link
											to={'/active-shuffling'}
											className="general-info-item top-right"
										>
											<div className="top-bar">
												{this.state.shuffling}
											</div>
											<div className="bottom-bar">
												Coin
												shuffling
											</div>
										</Link>
										<Link
											to="/dashboard"
											className="general-info-item bottom-left"
										>
                                            <div className="top-bar">
                                                {this.state.aliassesValue || 0}
                                            </div>
											<div className="bottom-bar">
												Aliases
											</div>
										</Link>
										<Link
											to={'/data-storage'}
											className="general-info-item bottom-right"
										>
											<div className="top-bar">
												{this.state.taggedData}
											</div>
											<div className="bottom-bar">
												Data
												storage
											</div>
										</Link>
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
													<Transaction key={uuid()} {...el}/>
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
											this.state.dashboardAssets &&
											this.state.dashboardAssets.map((el, index) => {
												if (index < 3) {
													return (
														<div key={uuid()} className="full-box-item coin">
															<div className="coin-data">
																<CircleFigure
																	index={index}
																	percentage={((parseInt(el.quantityATU) / parseInt(el.initialQuantityATU)) * 100).toFixed(2)}

																	type={el.quantityATU}
																/>
																<div
																	className="amount">
                                                                    {((parseInt(el.quantityATU) / parseInt(el.initialQuantityATU)) * 100).toFixed(2)} %
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
												<Link to={'/purchased-products'} className="digit">{this.state.numberOfGoods}</Link>
												<div className="subtitle">Purchased products</div>
											</div>
											<div className="marketplace-box">
												<div
													className="digit">
													<Link className="digit" to={'/my-panding-orders'}>
                                                        {this.state.pendingGoods}
													</Link>
													/
                                                    <Link className="digit" to={'/my-products-for-sale'}>
                                                        {this.state.completedGoods}
                                                    </Link>
												</div>
												<div className="subtitle">Sales</div>
											</div>
										</div>
									</div>
									<Link to="/marketplace" className="btn btn-left btn-simple">Marketplace</Link>
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
												<input placeholder={'Amount'} ref={'feeATM'} type={'number'}/>
											</div>
										</div>
									</div>
									<a
										onClick={this.props.setMopalType.bind(this, 'SEND_APOLLO_PRIVATE')}
									    className="btn btn-left btn-simple"
										style={{margin: '0 0 -7px 35px'}}
									>
										Private APL
									</a>
									<button
										className="btn btn-right gray round round-bottom-right round-top-left absolute"
										data-modal="sendMoney"
										onClick={() => this.props.setBodyModalParamsAction('SEND_APOLLO', {
											recipient: this.refs.recipient.value,
											amountATM: this.refs.amountATM.value,
											feeATM: this.refs.feeATM.value
										})}
									>
										Send&nbsp;
										<i className="arrow zmdi zmdi-chevron-right"/>
									</button>
								</div>
								<div className="card active-polls">
									<div className="card-title">Active Polls</div>
									<div
										className="full-box block"
										style={{
                                            display: 'flex',
                                            paddingBottom: '50px'
										}}
									>
										{
											this.state.polls &&
												this.state.polls.map((el) => {
                                                    return (
														<Link
															key={uuid()}
															style={{
																display: 'block',
																color: '#777777'
															}}
															to={'/followed-polls/' + el.poll}
														>
                                                            {el.name}
														</Link>
                                                    )
                                                })
										}
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
										onClick={() => {
											this.setState({newsItem: this.state.newsItem - 1})
										}}
									>
										<i className="arrow zmdi zmdi-chevron-left"/>&nbsp;
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
											onClick={() => {
												this.setState({newsItem: this.state.newsItem + 1})
											}}
										>
											Next&nbsp;
											<i className="arrow zmdi zmdi-chevron-right"/>
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
