import React from 'react';
import SiteHeader from '../../components/site-header'
import {connect} from 'react-redux';
import {getBlocksAction, getBlockAction} from "../../../actions/blocks";
import {setBodyModalParamsAction} from "../../../modules/modals";
import Block from './block';
import {BlockUpdater} from "../../block-subscriber";
import './Blocks.css';
import classNames from "classnames";
import {getNextBlockGeneratorsAction} from '../../../actions/blocks'
import {formatTimestamp} from "../../../helpers/util/time";
import {getTime} from '../../../actions/login/index'
import uuid from "uuid";

class Blocks extends React.Component {
	constructor(props) {
		super(props);

		this.getBlocks = this.getBlocks.bind(this);
		this.getBlock = this.getBlock.bind(this);

		this.state = {
			page: 1,
			firstIndex: 0,
			lastIndex: 14,
			blocks: [],

			avgFee: 0,
			avgAmount: 0,
			blockGenerateTime: 0,
			transactionPerHour: 0,
		};
	}

	listener = data => {
		this.getBlocks({
			account: this.props.account,
			firstIndex: this.state.firstIndex,
			lastIndex: this.state.lastIndex
		});
	};

	componentDidMount() {
		BlockUpdater.on("data", this.listener)
	}

	componentWillUnmount() {
		BlockUpdater.removeListener("data", this.listener)
	}

	componentWillMount() {
		this.getBlocks({
			account: this.props.account,
			firstIndex: this.state.firstIndex,
			lastIndex: this.state.lastIndex
		});
	}

	getNextBlock = async () => {
		const nextBlock = await getNextBlockGeneratorsAction();

		const currentTime = await this.props.getTime();

		console.log(nextBlock.generators[0].hitTime - currentTime.time);


	};

	async getBlocks(requestParams) {
		const blocks = (await this.props.getBlocksAction(requestParams)).blocks;
		let totalFee = 0;
		let totalAmount = 0;
		const time = Math.round((blocks[0].timestamp - blocks[blocks.length - 1].timestamp) / 15);
		let transactions = 0;

		let avgFee = 0;
		let avgAmount = 0;
		blocks.forEach(block => {
			totalFee += parseFloat(block.totalFeeATM);
			totalAmount += parseFloat(block.totalAmountATM);
			transactions += parseFloat(block.numberOfTransactions);

			console.log(transactions);
		});

		console.log(transactions);


		if (time === 0) {
			transactions = 0
		} else {
			transactions = Math.round((transactions / (time / 60) * 60));
		}

		if (blocks.length) {
			avgFee = (totalFee / 100000000 / blocks.length).toFixed(2);
			avgAmount = (totalAmount / 100000000 / blocks.length).toFixed(2);
		}

		console.log(transactions);

		this.setState({
			...this.props,
			blocks: blocks,
			avgFee,
			avgAmount,
			blockGenerateTime: time,
			transactionPerHour: transactions
		});
	}

	async getBlock(type, blockHeight) {
		const requestParams = {
			height: blockHeight
		};

		const block = await this.props.getBlockAction(requestParams);

		if (block) {
			this.props.setBodyModalParamsAction('INFO_BLOCK', block)
		}
	}

	onPaginate(page) {
		this.setState({
			page: page,
			account: this.props.account,
			firstIndex: page * 15 - 15,
			lastIndex: page * 15 - 1
		}, () => {
			this.getBlocks({
				account: this.props.account,
				firstIndex: this.state.firstIndex,
				lastIndex: this.state.lastIndex
			})
		});
	}

	render() {
		return (
			<div className="page-content">
				<SiteHeader
					pageTitle={'Blocks'}
				/>
				<div className="page-body container-fluid">
					<div className="blocks">
						<div className="row">
							<div className="col-md-6 col-lg-3">
								<div className="card header ballance single">
									<div className="card-title">AVG. Amount Per Block</div>
									<div className="amount">{this.state.avgAmount}</div>
								</div>
							</div>
							<div className="col-md-6 col-lg-3">
								<div className="card header assets single">
									<div className="card-title">AVG. Fee Per Block</div>
									<div className="amount">{this.state.avgFee}</div>
								</div>
							</div>
							<div className="col-sm-12 col-md-6 col-lg-3">
								<div className="card header currencies single">
									<div className="card-title">Transactions Per Hour</div>
									<div className="amount">{this.state.transactionPerHour}</div>
								</div>
							</div>
							<div className="col-md-6 col-lg-3">
								<div className="card header coins single">
									<div className="card-title">Block Generation Time</div>
									<div className="amount">{this.state.blockGenerateTime}s</div>
								</div>
							</div>
						</div>
						<div className="transaction-table">
							<div className="transaction-table-body">
								<table>
									<thead>
									<tr>
										<td>Height</td>
										<td className="align-right">Date</td>
										<td className="align-right">Amount</td>
										<td className="align-right">Fee</td>
										<td className="align-right"># TX</td>
										<td>Generator</td>
										<td className="align-right">Payload</td>
										<td className="align-right">Base Target</td>
									</tr>
									</thead>
									<tbody>
									{
										this.state.blocks.map((el, index) => {
											return (
												<Block
                                                    key={uuid()}
													block={el}
													setBlockInfo={this.getBlock}
												/>
											);
										})
									}
									</tbody>
								</table>
								<div className="btn-box">
									<a
										className={classNames({
											'btn': true,
											'btn-left': true,
											'disabled': this.state.page <= 1
										})}
										onClick={this.onPaginate.bind(this, this.state.page - 1)}
									> Previous</a>
									<div className='pagination-nav'>
										<span>{this.state.firstIndex + 1}</span>
										<span>&hellip;</span>
										<span>{this.state.lastIndex + 1}</span>
									</div>
									<a
										onClick={this.onPaginate.bind(this, this.state.page + 1)}
										className={classNames({
											'btn': true,
											'btn-right': true,
											'disabled': this.state.blocks.length < 15
										})}
									>Next</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	account: state.account.account
});

const mapDispatchToProps = dispatch => ({
	getBlocksAction: (requestParams) => dispatch(getBlocksAction(requestParams)),
	getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
	setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
	formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
	getTime: () => dispatch(getTime())
})

export default connect(mapStateToProps, mapDispatchToProps)(Blocks);