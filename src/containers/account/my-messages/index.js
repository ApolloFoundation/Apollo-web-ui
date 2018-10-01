/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import uuid from "uuid";
import classNames from "classnames";
import SiteHeader from "../../components/site-header"
import MessageItem from './message-item'
import {connect} from 'react-redux';
import {getMessages} from "../../../actions/messager";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber/index";
import InfoBox from "../../components/info-box";
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getMessages: (reqParams) => dispatch(getMessages(reqParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

class MyMessages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 14,
            messages: null
        };
    }

    componentDidMount() {
        this.getMessages({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.updateMessangerData();
        });
    }

    componentWillReceiveProps() {
        this.getMessages({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    updateMessangerData = () => {
        this.getMessages({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    };

    getMessages = async (reqParams) => {
        const messages = await this.props.getMessages(reqParams);

        if (messages && this.props.account) {
            this.setState({
                ...this.state,
                messages: messages.transactions
            })
        }
    };

    onPaginate = (page) => {
        let reqParams = {
            account: this.props.account,
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        };


        this.setState(reqParams, () => {
            this.getMessages(reqParams)
        });
    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My messages'}
                >
                    <a
                        onClick={() => this.props.setBodyModalParamsAction('COMPOSE_MESSAGE', null)}
                        className="btn primary"
                    >
                        Compose message
                    </a>
                </SiteHeader>
                <ContentHendler
                    items={this.state.messages}
                    emptyMessage={'No messages found.'}
                >
                    {
                        this.state.messages && !!this.state.messages.length &&
                        <div className="page-body container-fluid" style={{'minHeight': '100vh', 'paddingTop': '120px'}}>
                            <div className="account-ledger">
                                <div className="transaction-table message-table">
                                    <div className="transaction-table-body">
                                        <table>
                                            <thead>
                                            <tr>
                                                <td>Date</td>
                                                <td>From</td>
                                                <td>To</td>
                                                <td>Message</td>
                                                <td className="align-right">Action</td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.messages.map((el, index) => {
                                                    return (
                                                        <MessageItem
                                                            key={uuid()}
                                                            {...el}
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
                                                    'disabled' : this.state.messages.length < 15
                                                })}
                                            >
                                                Next
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </ContentHendler>

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyMessages);