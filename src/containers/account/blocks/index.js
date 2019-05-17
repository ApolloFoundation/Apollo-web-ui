/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


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
import {ONE_APL} from '../../../constants';

import CustomTable from '../../components/tables/table';
import TopPageBlocks from '../../components/tob-page-blocks';

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
		});

		if (time === 0) {
			transactions = 0
		} else {
			transactions = Math.round((transactions / (time / 60) * 60));
		}

		if (blocks.length) {
			avgFee = (totalFee / ONE_APL / blocks.length).toFixed(2);
			avgAmount = (totalAmount / ONE_APL / blocks.length).toFixed(2);
		}

		this.setState({
			...this.props,
			blocks: blocks,
			avgFee,
			avgAmount,
			blockGenerateTime: time,
			transactionPerHour: Math.floor(transactions / 15)
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

	onPaginate = (page) => {
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

					<div className="">

						<TopPageBlocks
							cards={[
								{
									label: 'AVG. Amount Per Block',
									value: this.state.avgAmount
								},{
									label: 'AVG. Fee Per Block',
									value: this.state.avgFee
								},{
									label: 'Transactions Per Hour',
									value: this.state.transactionPerHour
								},{
									label: 'Transactions Per Hour',
									value: [
										{
											label: 'Transaction Time',
											value: this.props.blockTime
										},
										{
											label: 'Average Block Creating Frequency',
											value: `${this.state.blockGenerateTime} s`
										}
									]
								}
							]}
						/>

						<CustomTable
							header={[
                                {
                                    name: 'Height',
                                    alignRight: false
                                },{
                                    name: 'Date',
                                    alignRight: true
                                },{
                                    name: 'Amount',
                                    alignRight: true
                                },{
                                    name: 'Fee',
                                    alignRight: true
                                },{
                                    name: '# TX',
                                    alignRight: true
                                },{
                                    name: 'Generator',
                                    alignRight: false
                                },{
                                    name: 'Payload',
                                    alignRight: true
                                }
                            ]}
							TableRowComponent={Block}
							tableData={this.state.blocks}
							isPaginate
							page={this.state.page}
							previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
							nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
							className={'no-min-height mb-3'}
							emptyMessage={'No aliases found.'}
						/>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	account: state.account.account,
	blockTime: state.account.blockchainStatus ? state.account.blockchainStatus.blockTime : null
});

const mapDispatchToProps = dispatch => ({
	getBlocksAction: (requestParams) => dispatch(getBlocksAction(requestParams)),
	getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
	setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
	formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
	getTime: () => dispatch(getTime())
})

export default connect(mapStateToProps, mapDispatchToProps)(Blocks);
