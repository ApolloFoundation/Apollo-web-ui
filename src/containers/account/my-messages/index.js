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
import {setBodyModalParamsAction} from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber/index";
import InfoBox from "../../components/info-box";
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'

import CustomTable from '../../components/tables/table';
import {getMessagesPerpage} from '../../../actions/messager'

class MyMessages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 14,
            messages: null,
            isLoading: false,
            account: null
        };
    }

    componentDidMount() {
        this.props.getMessagesPerpage({firstIndex: 0, lastIndex: 14});

        BlockUpdater.on("data", data => {
            const {page} = this.state;

            this.props.getMessagesPerpage({ 
                firstIndex: page * 15 - 15,
                lastIndex: page * 15 - 1
            });
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    onPaginate = (page) => {
        let reqParams = {
            firstIndex: page * 15 - 15,
            lastIndex: page * 15 - 1
        };

        this.props.getMessagesPerpage(reqParams)

        this.setState({page});
    }

    render() {
        const {page} = this.state;
        const {messages, setBodyModalParamsAction} = this.props;

        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My messages'}
                >
                    <a
                        onClick={() => setBodyModalParamsAction('COMPOSE_MESSAGE', null)}
                        className="btn primary"
                    >
                        Compose message
                    </a>
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
                        page={page}
                        TableRowComponent={MessageItem}
                        tableData={this.props.messages}
                        isPaginate
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
    messages: state.messages.messages
});

const mapDispatchToProps = dispatch => ({
    getMessagesPerpage: (reqParams) => dispatch(getMessagesPerpage(reqParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyMessages);