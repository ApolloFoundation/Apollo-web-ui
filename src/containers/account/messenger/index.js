/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header';
import {connect} from 'react-redux';
import {getChatsPerPage, getChatHistory} from "../../../actions/messager";
import './Messenger.scss';
import {BlockUpdater} from "../../block-subscriber/index";
import crypto from "../../../helpers/crypto/crypto";
import {setBodyModalParamsAction} from "../../../modules/modals";

import SidebarContent from '../../components/sidebar-list';
import Chat from './chat';
import SidebarMessage from './sidebar-messenger/';
import SidebarContentPage from '../../components/sidebar-content-page';

class Messenger extends React.Component {

	componentDidMount () {
        this.props.getChatHistory({account2: this.props.match.params.chat});
        this.props.getChatsPerPage();

        BlockUpdater.on("data", data => {
            this.props.getChatHistory({account2: this.props.match.params.chat});
        });
    };
    
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.props.getChatHistory();
            this.props.getChatHistory({account2: this.props.match.params.chat});
        }
    }

    getFormApi = async (formApi) => {
		this.setState({formApi})
	};


	render (){
		
        const {chats} = this.props;

		return (
			<div className="page-content">
				<SiteHeader
					pageTitle={'Messenger'}
				>
                    <a
                        onClick={() => this.props.setBodyModalParamsAction('COMPOSE_MESSAGE', null)}
                        className="btn primary"
                    >
                        Compose message
                    </a>
				</SiteHeader>
                <SidebarContentPage
                    SidebarContent={() => (
                        <SidebarContent
                            baseUrl={'/messenger/'}
                            element={'accountRS'}
                            data={chats}
                            emptyMessage={'No assets found.'}
                            Component={SidebarMessage}
                        />
                    )}
                    PageContent={() => (
                        <Chat />
                    )}
                    pageContentClassName={'pl-3 pr-0'}
                />
			</div>
		);
	}
}

const mapStateToProps = state => ({
	account: state.account.account,
    is2FA: state.account.is2FA,
    chatMessages: state.messages.chatMessages,
    chats: state.messages.chats
});

const mapDispatchToProps = dispatch => ({
    getChatsPerPage: (reqParams) => dispatch(getChatsPerPage(reqParams)),
    getChatHistory: (reqParams) => dispatch(getChatHistory(reqParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    setBodyModalParamsAction: (type, values) => dispatch(setBodyModalParamsAction(type, values))
});

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);