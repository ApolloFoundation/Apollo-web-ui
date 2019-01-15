/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from "react";
import {connect} from "react-redux";
import SiteHeader from "../../components/site-header";
import {BlockUpdater} from "../../block-subscriber";
import {getGeneratorsAction} from "../../../actions/generators";
import {formatTimestamp} from "../../../helpers/util/time";
import Generator from "../../../actions/generators/generator";
import uuid from "uuid";
import ContentLoader from '../../components/content-loader'

class Generators extends React.Component {
    state = {
        generators: [],
        lastBlockTime: "",
        height: "",
        timestamp: 0,
        activeForgers: 0,
    };

    formDate = date => {
        if (!date) return "";
        const lastUpdDate = new Date(Date.now() - date);
        const month = lastUpdDate.getMonth();
        const day = lastUpdDate.getDay();
        const year = lastUpdDate.getFullYear();
        const time = lastUpdDate.getHours() + ":" + lastUpdDate.getMinutes() + ":" + lastUpdDate.getSeconds();
        return `${month}/${day}/${year} ${time}`;
    };

    listener = data => {
        this.getGenerators();
    }

    componentDidMount = () => {
        this.getGenerators();
        BlockUpdater.on("data", this.listener);
    };

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    getGenerators = () => this.props.getGeneratorsAction()
        .then(generators => this.setState({
            generators: generators.generators,
            lastBlockTime: this.props.formatTimestamp(generators.timestamp),
            height: generators.height,
            activeForgers: generators.activeCount,
            timestamp: generators.timestamp
        }));

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Generators'}
                />
                <div className="page-body container-fluid">
                    <div className="blocks">
                        <div className="row">
                            <div className="col-md-6 col-lg-6 col-xl-3 pb-4">
                                <div className="card chart-sprite position-1 header ballance single">
                                    <div className="card-title">Last Block</div>
                                    <div className="amount">{this.state.lastBlockTime}</div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-3 pb-4">
                                <div className="card chart-sprite position-2 header assets single">
                                    <div className="card-title">Height</div>
                                    <div className="amount">{this.state.height}</div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-3 pb-4">
                                <div className="card chart-sprite position-3 header currencies single">
                                    <div className="card-title">Active Forgers</div>
                                    <div className="amount">{this.state.activeForgers}</div>
                                </div>
                            </div>
                        </div>
                        <div className="info-box info">
                            <p>Information in this table is delayed by up to 30 seconds, use the desktop wallet for more up to date information.</p>
                        </div>
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td className="align-left">Account</td>
                                        <td className="align-right">Effective Balance</td>
                                        <td className="align-right">Hit Time</td>
                                        <td className="align-right">Deadline</td>
                                        <td className="align-right">Remaining</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.generators.map(el => {
                                            return (
                                                <Generator
                                                    key={uuid()}
                                                    generator={el}
                                                    resTimestamps={this.state.timestamp}
                                                    epochB={this.props.epochB}
                                                />
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    epochB: state.account.constants.epochBeginning,
});

const mapDispatchToProps = dispatch => ({
    getGeneratorsAction: () => dispatch(getGeneratorsAction()),
    formatTimestamp: time => dispatch(formatTimestamp(time))
});

export default connect(mapStateToProps, mapDispatchToProps)(Generators);