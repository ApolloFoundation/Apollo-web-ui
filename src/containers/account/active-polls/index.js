/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {getAliasesAction} from "../../../actions/aliases";
import SiteHeader from '../../components/site-header'
import {getpollsAction} from '../../../actions/polls';
import PoolItem from './pool-item';
import uuid from "uuid";
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {Link} from 'react-router-dom';
import InfoBox from '../../components/info-box';
import {BlockUpdater} from "../../block-subscriber";

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getpollsAction: (reqParams) => dispatch(getpollsAction(reqParams)),
    getAliasesAction: (reqParams) => dispatch(getAliasesAction(reqParams)),
    getTransactionAction:     (requestParams) => dispatch(getTransactionAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});


class Activepolls extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstIndex: 0,
            lastIndex: 14,
            page: 1,
            activepolls: null,
            finishedpolls: null
        };

        this.getActivepolls   = this.getActivepolls.bind(this);
        this.getFinishedpolls = this.getFinishedpolls.bind(this);
        this.getTransaction   = this.getTransaction.bind(this);
    }

    listener = data => {
        this.getActivepolls();

        this.getFinishedpolls({
            firstIndex: 0,
            lastIndex:  9,
        });
    };

    componentDidMount() {
        this.getActivepolls();

        this.getFinishedpolls({
            firstIndex: 0,
            lastIndex:  9,
        });
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    };

    componentWillReceiveProps(newState) {
        this.getActivepolls();
        this.getFinishedpolls({
            firstIndex: 0,
            lastIndex:  9,
        });
    }

    async getActivepolls(reqParams){
        reqParams = {
            ...reqParams,
            includeFinished: false,
        };

        const activepolls = await this.props.getpollsAction(reqParams);

        if (activepolls) {
            this.setState({
                ...this.props,
                activepolls: activepolls.polls
            });
        }
    }

    async getFinishedpolls(reqParams){
        reqParams = {
            ...reqParams,
            finishedOnly: true
        };

        const finishedpolls = await this.props.getpollsAction(reqParams);

        if (finishedpolls) {
            this.setState({
                ...this.props,
                finishedpolls: finishedpolls.polls
            });
        }
    }

    async getTransaction(data) {
        const reqParams = {
            transaction: data,
            account: this.props.account
        };

        const transaction = await this.props.getTransactionAction(reqParams);
        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }

    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Active polls'}
                />
                <div className="page-body container-fluid">
                    <div className="active-polls white-space">
                        <div className="transaction-table no-min-height">
                            <div className="transaction-table-body">

                        {
                            this.state.activepolls &&
                                <React.Fragment>
                                    {
                                        this.state.activepolls &&
                                        !!this.state.activepolls.length &&
                                        <table>
                                            <thead>
                                            <tr>
                                                <td>Title</td>
                                                <td>Description</td>
                                                <td>Sender</td>
                                                <td>Start date</td>
                                                <td>Blocks left</td>
                                                <td className="align-right">Actions</td>
                                            </tr>
                                            </thead>
                                            <tbody  key={uuid()}>
                                            {
                                                this.state.activepolls &&
                                                this.state.activepolls.map((el, index) => {

                                                    return (
                                                        <PoolItem
                                                            key={uuid()}
                                                            {...el}
                                                            activepolls
                                                            getTransaction={this.getTransaction}
                                                        />
                                                    );
                                                })
                                            }
                                            </tbody>
                                        </table>
                                    }
                                    {
                                        this.state.activepolls &&
                                        !(!!this.state.activepolls.length) &&
                                        <InfoBox default>
                                            No active polls yet.
                                        </InfoBox>
                                    }
                                </React.Fragment> ||
                                <div
                                    style={{
                                        paddingLeft: 47.5
                                    }}
                                    className={'loader-box'}
                                >
                                    <div className="ball-pulse">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>

                            }
                        </div>
                        </div>

                        <div className="form-group-app offset-bottom height-auto no-padding">
                            <div className="form-title padding-left padding-top">
                                <p>Finished polls</p>
                            </div>
                            {
                                this.state.finishedpolls &&
                                <div className="transaction-table no-min-height">
                                    <div className="transaction-table-body offset-bottom">
                                        <table>
                                            <thead>
                                            <tr>
                                                <td>Title</td>
                                                <td>Description</td>
                                                <td>Sender</td>
                                                <td>Start date</td>
                                                <td>Blocks left</td>
                                                <td className="align-right">Actions</td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.finishedpolls &&
                                                this.state.finishedpolls.map((el, index) => {
                                                    return (
                                                        <PoolItem
                                                            key={uuid()}
                                                            {...el}
                                                            activepolls
                                                            getTransaction={this.getTransaction}
                                                        />
                                                    );
                                                })
                                            }
                                            </tbody>
                                        </table>
                                        <div className="btn-box">
                                            <Link to="/finished-polls" className="btn btn-right blue" >View more</Link>
                                        </div>
                                    </div>
                                </div>   ||
                                <div
                                    style={{
                                        paddingLeft: 47.5
                                    }}
                                    className={'loader-box'}
                                >
                                    <div className="ball-pulse">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Activepolls);