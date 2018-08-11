import React from 'react';
import SiteHeader from '../../components/site-header'
import {connect} from 'react-redux';
import {getBlocksAction, getBlockAction} from "../../../actions/blocks";
import {setBodyModalParamsAction} from "../../../modules/modals";
import Block from './block';

import './Blocks.css';
import classNames from "classnames";


class Blocks extends React.Component {
    constructor(props) {
        super(props);

        this.getBlocks = this.getBlocks.bind(this);
        this.getBlock  = this.getBlock.bind(this);

        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 14,
            blocks: []
        };
    }

    componentWillMount() {
        this.getBlocks({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    }

    async getBlocks(requestParams) {
        const ledger = await this.props.getBlocksAction(requestParams);
        this.setState({
            ...this.props,
            blocks: ledger.blocks
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

    onPaginate (page) {
        this.setState({
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        }, () => {
            this.getBlocks({
                account: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            })
        });
    }

    render () {
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
                                    <div className="card-title">Available Balance</div>
                                    <div className="amount">37,000,000</div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="card header assets single">
                                    <div className="card-title">Available Balance</div>
                                    <div className="amount">37,000,000</div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-3">
                                <div className="card header currencies single">
                                    <div className="card-title">Available Balance</div>
                                    <div className="amount">37,000,000</div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="card header coins single">
                                    <div className="card-title">Available Balance</div>
                                    <div className="amount">37,000,000</div>
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
                                            'btn' : true,
                                            'btn-left' : true,
                                            'disabled' : this.state.page <= 1
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
                                            'btn' : true,
                                            'btn-right' : true,
                                            'disabled' : this.state.blocks.length < 15
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
    getBlocksAction : (requestParams) => dispatch(getBlocksAction(requestParams)),
    getBlockAction  : (requestParams) => dispatch(getBlockAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))

})

export default connect(mapStateToProps, mapDispatchToProps)(Blocks);