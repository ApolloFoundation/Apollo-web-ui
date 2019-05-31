/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header';
import {connect} from 'react-redux';
import './Messenger.scss';
import {BlockUpdater} from "../../block-subscriber/index";
import {getChatsPerPage, getChatHistory} from "../../../actions/messager";

import {setBodyModalParamsAction} from "../../../modules/modals";
import Chat from './chat';
import SidebarMessages from './sidebar-messenger/';
import SidebarContentPage from '../../components/sidebar-content-page';

class Messenger extends React.PureComponent {
    listener = () => this.props.getChatHistory({account2: this.props.match.params.chat});

    componentDidMount () {
        this.props.getChatHistory({account2: this.props.match.params.chat});
        this.props.getChatsPerPage();
        if (!BlockUpdater.listeners('data').length) {
            BlockUpdater.on("data", data => {
                this.listener();
            });
        }
    };

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    };
    
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.listener();
        }
    }

	render (){

		return (
			<div className="page-content">
				<SiteHeader
					pageTitle={'Messenger'}
				>
                    <button
                        type={'button'}
                        onClick={() => this.props.setBodyModalParamsAction('COMPOSE_MESSAGE', null)}
                        className="btn btn-green btn-sm"
                    >
                        Compose message
                    </button>
				</SiteHeader>
                <SidebarContentPage
                    SidebarContent={() => (
                        <SidebarMessages />
                    )}
                    PageContent={() => (
                        <Chat/>
                    )}
                    pageContentClassName={'pl-3 pr-0'}
                />
			</div>
		);
	}
}

const mapStateToProps = state => ({
	account: state.account.account,
});

const mapDispatchToProps = {
    getChatsPerPage,
    getChatHistory,
    setBodyModalParamsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);