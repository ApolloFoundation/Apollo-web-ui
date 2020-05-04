/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import classNames from "classnames";
import SiteHeader from "../../components/site-header"
import MessageItem from './message-item'
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber/index";
import InfoBox from "../../components/info-box";
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'

import CustomTable from '../../components/tables/table';
import {getMessagesPerpage} from '../../../actions/messager'

const itemsPerPage = 15;

class MyMessages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: itemsPerPage,
            messages: null,
            isLoading: false,
            account: null
        };
    }

    listener = () => this.getMessagesPerpage();

    componentDidMount() {
        this.getMessagesPerpage();

        if (!BlockUpdater.listeners('data').length) {
            BlockUpdater.on("data", data => {
                if (!this.state.isLoading) {
                    this.listener();
                }
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.passPhrase !== this.props.passPhrase) {
            this.listener();
        }
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    getMessagesPerpage = async (pagination) => {
        this.setState({isLoading: true});
        if (!pagination) {
            pagination = {
                page: this.state.page,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            };
        }

        await this.props.getMessagesPerpage({
            firstIndex: pagination.firstIndex,
            lastIndex: pagination.lastIndex
        });

        this.setState({
            ...pagination,
            isLoading: false
        });
    };

    onPaginate = (page) => {
        const pagination = {
            page: page,
            firstIndex: page * itemsPerPage - itemsPerPage,
            lastIndex: page * itemsPerPage
        };

        this.getMessagesPerpage(pagination);
    };

    render() {
        const {messages, setBodyModalParamsAction} = this.props;

        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My messages'}
                >
                    <button
                        type={'button'}
                        onClick={() => setBodyModalParamsAction('COMPOSE_MESSAGE', null)}
                        className="btn btn-green btn-sm"
                    >
                        Compose message
                    </button>
                </SiteHeader>
                <div className="page-body container-fluid">
                    <CustomTable
                        header={[
                            {
                                name: 'Date',
                                alignRight: false
                            },{
                                name: 'From',
                                alignRight: false
                            },{
                                name: 'To',
                                alignRight: false
                            },{
                                name: 'Message',
                                alignRight: false
                            },{
                                name: 'Action',
                                alignRight: true
                            }
                        ]}
                        emptyMessage={'No messages found.'}
                        className={'mb-3'}
                        TableRowComponent={MessageItem}
                        tableData={messages}
                        isPaginate
                        itemsPerPage={itemsPerPage}
                        page={this.state.page}
                        previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                        nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,
    messages: state.messages.messages,
    passPhrase: state.account.passPhrase,
});

const mapDispatchToProps = dispatch => ({
    getMessagesPerpage: (reqParams) => dispatch(getMessagesPerpage(reqParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyMessages);
