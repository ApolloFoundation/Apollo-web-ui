/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {Form, Text} from 'react-form';
import {NotificationManager} from "react-notifications";
import SiteHeader from '../../components/site-header'
import {
    getAccountBlockCountAction,
    getBlockAction,
    getBlocksAction,
    getForgedBlocksAction,
    getNextBlockGeneratorsAction
} from "../../../actions/blocks";
import {getTime} from '../../../actions/login';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber";
import {formatTimestamp} from "../../../helpers/util/time";
import Block from './block';
import './Blocks.scss';

import CustomTable from '../../components/tables/table';
import TopPageBlocks from '../../components/tob-page-blocks';
import TabContaier from "../../components/tabulator/tab-container";
import TabulationBody from "../../components/tabulator/tabuator-body";

class Blocks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isForged: false,
            page: 1,
            firstIndex: 0,
            lastIndex: 15,
            height: '',
            blocks: null,
			blocksInfo: {
				avgFee: 0,
				avgAmount: 0,
				blockGenerateTime: 0,
				transactionPerHour: 0,
			},

			blocksForged: null,
			forgedInfo: {
				avgFee: 0,
				avgAmount: 0,
				forgedBlocks: 0,
				forgedFees: 0,
			},
        };
    }

    listener = data => {
        if(this.state.isForged) {
            this.getForgedBlocks({
                account: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
        } else {
            this.getBlocks({
                account: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
        }
    };

    componentDidMount() {
        this.startListenBlocks();
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    startListenBlocks = () => {
        this.getBlocks({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
        BlockUpdater.on("data", this.listener)
    }

    getNextBlock = async () => {
        const nextBlock = await getNextBlockGeneratorsAction();

        const currentTime = await this.props.getTime();
    };

    getBlocks = async (requestParams) => {
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
            avgFee = (totalFee / this.props.decimals / blocks.length).toFixed(2);
            avgAmount = (totalAmount / this.props.decimals / blocks.length).toFixed(2);
        }

        this.setState({
            ...requestParams,
            blocks: blocks,
			blocksInfo: {
				avgFee,
				avgAmount,
				blockGenerateTime: time,
				transactionPerHour: Math.floor(transactions / 15)
			}
        });
    };

    getForgedBlocks = async (requestParams) => {
        const blocks = (await this.props.getForgedBlocksAction(requestParams)).blocks;
        const blockCount = await this.props.getAccountBlockCountAction(requestParams);
        let avgFee = 0;
        let forgedBlocks = 0;
        if (blockCount.numberOfBlocks && blockCount.numberOfBlocks > 0) {
            forgedBlocks = blockCount.numberOfBlocks;
            avgFee = (this.props.forgedBalanceATM / blockCount.numberOfBlocks / this.props.decimals).toFixed(2);
        }

        let totalFee = 0;
        let totalAmount = 0;
        let transactions = 0;

        let avgAmount = 0;
        blocks.forEach(block => {
            totalFee += parseFloat(block.totalFeeATM);
            totalAmount += parseFloat(block.totalAmountATM);
            transactions += parseFloat(block.numberOfTransactions);
        });

        if (blocks.length) {
            avgAmount = (totalAmount / this.props.decimals / blocks.length).toFixed(2);
        }

        this.setState({
            ...requestParams,
			blocksForged: blocks,
			forgedInfo: {
				avgFee,
				avgAmount,
				transactionPerHour: Math.floor(transactions / 15),
                forgedFees: this.props.forgedBalanceATM / this.props.decimals,
                forgedBlocks,
			}
        });
    };

    getBlock = async ({height}) => {
        if (!height) {
            this.startListenBlocks();
            return
        }
        const block = await this.props.getBlockAction({height});
        if (block) {
            BlockUpdater.removeListener("data", this.listener)
            this.setState({blocks: [block]})
        } else {
            NotificationManager.error('Incorrect height', 'Error', 5000)
        }
    };

    onPaginate = (page, isForged) => {
        const pagination = {
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15,
            isForged: !!isForged
        };

        if (!!isForged) {
			this.getForgedBlocks(pagination);
		} else {
			this.getBlocks(pagination);
		}
    };

	handleChangeTab = (e, index) => {
		this.onPaginate(1, index)
	};

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Blocks'}
                />
                <div className="page-body container-fluid mb-3">
                    <div className="transactions-filters">
                        <Form
                            onSubmit={this.getBlock}
                            render={({submitForm}) => {
                                return (
                                    <form
                                        onSubmit={submitForm}
                                        className="input-group-app search col-md-3 pl-0"
                                    >
                                        <div className="iconned-input-field block">
                                            <Text
                                                placeholder={'Block height'}
                                                field={'height'}
                                                type="text"
                                            />
                                            <button
                                                type={'submit'}
                                                className="input-icon"
                                                style={{width: 41}}
                                            >
                                                <i className="zmdi zmdi-search"/>
                                            </button>
                                        </div>
                                    </form>
                                )
                            }}
                        />
                    </div>
                    <div className="form-group-app transparent">
                        <TabulationBody
							className={'p-0'}
							onChange={this.handleChangeTab}
						>
                            <TabContaier sectionName={'Blocks'}>
                                <TopPageBlocks
                                    cards={[
                                        {
                                            label: 'AVG. Amount Per Block',
                                            value: this.state.blocksInfo.avgAmount
                                        }, {
                                            label: 'AVG. Fee Per Block',
                                            value: this.state.blocksInfo.avgFee
                                        }, {
                                            label: 'Transactions Per Hour',
                                            value: this.state.blocksInfo.transactionPerHour
                                        }, {
                                            label: 'Transactions Per Hour',
                                            value: [
                                                {
                                                    label: 'Transaction Time',
                                                    value: this.props.blockTime
                                                },
                                                {
                                                    label: 'Avg. Block Creating Frequency',
                                                    value: `${this.state.blocksInfo.blockGenerateTime} s`
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
                                        }, {
                                            name: 'Date',
                                            alignRight: true
                                        }, {
                                            name: 'Amount',
                                            alignRight: true
                                        }, {
                                            name: 'Fee',
                                            alignRight: true
                                        }, {
                                            name: '# TX',
                                            alignRight: true
                                        }, {
                                            name: 'Generator',
                                            alignRight: false
                                        }, {
                                            name: 'Payload',
                                            alignRight: true
                                        }, {
                                            name: 'Base Target',
                                            alignRight: true
                                        }
                                    ]}
                                    TableRowComponent={Block}
                                    tableData={this.state.blocks}
                                    isPaginate
                                    page={this.state.page}
                                    previousHendler={this.onPaginate.bind(this, this.state.page - 1, false)}
                                    nextHendler={this.onPaginate.bind(this, this.state.page + 1, false)}
                                    className={'no-min-height'}
                                    emptyMessage={'No blocks found.'}
                                    itemsPerPage={15}
                                />
                            </TabContaier>
							<TabContaier sectionName={'Forged by You'}>
								<TopPageBlocks
									cards={[
										{
											label: 'AVG. Amount Per Block',
											value: this.state.forgedInfo.avgAmount
										}, {
											label: 'AVG. Fee Per Block',
											value: this.state.forgedInfo.avgFee
										}, {
											label: 'Transaction Time',
											value: this.props.blockTime
										}, {
											label: '# Forged Blocks',
											value: [
												{
													label: '# Forged Blocks',
													value: this.state.forgedInfo.forgedBlocks
												},
												{
													label: 'Forged Fees Total',
													value: `${this.state.forgedInfo.forgedFees}`
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
										}, {
											name: 'Date',
											alignRight: true
										}, {
											name: 'Amount',
											alignRight: true
										}, {
											name: 'Fee',
											alignRight: true
										}, {
											name: '# TX',
											alignRight: true
										}, {
											name: 'Generator',
											alignRight: false
										}, {
											name: 'Payload',
											alignRight: true
										}, {
											name: 'Base Target',
											alignRight: true
										}
									]}
									TableRowComponent={Block}
									tableData={this.state.blocksForged}
									isPaginate
									page={this.state.page}
									previousHendler={this.onPaginate.bind(this, this.state.page - 1, true)}
									nextHendler={this.onPaginate.bind(this, this.state.page + 1, true)}
									className={'no-min-height'}
									emptyMessage={'No forged blocks found.'}
									itemsPerPage={15}
								/>
							</TabContaier>
                        </TabulationBody>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,
    decimals: state.account.decimals,
    forgedBalanceATM: state.account.forgedBalanceATM,
    blockTime: state.account.blockchainStatus ? state.account.blockchainStatus.blockTime : null
});

const mapDispatchToProps = dispatch => ({
    getBlocksAction: (requestParams) => dispatch(getBlocksAction(requestParams)),
	getForgedBlocksAction: (requestParams) => dispatch(getForgedBlocksAction(requestParams)),
    getAccountBlockCountAction: (requestParams) => dispatch(getAccountBlockCountAction(requestParams)),
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    getTime: () => dispatch(getTime())
});

export default connect(mapStateToProps, mapDispatchToProps)(Blocks);
