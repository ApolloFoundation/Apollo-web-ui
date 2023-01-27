/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import {BlockUpdater} from "../../block-subscriber/index";
import {getChatsPerPage, getChatHistory, resetChatHistory} from "../../../actions/messager";
import {setBodyModalParamsAction} from "../../../modules/modals";
import SidebarContentPage from '../../components/sidebar-content-page';
import { getAccountSelector, getPassPhraseSelector } from '../../../selectors';
import Chat from './chat';
import SidebarMessages from './sidebar-messenger';
import './Messenger.scss';

class Messenger extends React.PureComponent {
    listener = () => this.props.getChatHistory({account2: this.props.match.params.chat});

    componentDidMount () {
        this.props.getChatHistory({account2: this.props.match.params.chat});
        this.props.getChatsPerPage();
        BlockUpdater.on("data", this.listener);
    };

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener);
    };
    
    componentDidUpdate(prevProps) {
        if (prevProps.passPhrase !== this.props.passPhrase) {
            this.listener();
        } else if (this.props.location.pathname !== prevProps.location.pathname) {
            this.props.resetChatHistory();
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
                    className={'messenger-height'}
                    SidebarContent={SidebarMessages}
                    PageContent={Chat}
                    pageContentClassName={'pl-3 pr-0'}
                />
			</div>
		);
	}
}

const mapStateToProps = state => ({
	account: getAccountSelector(state),
    passPhrase: getPassPhraseSelector(state),
});

const mapDispatchToProps = {
    getChatsPerPage,
    getChatHistory,
    setBodyModalParamsAction,
    resetChatHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Messenger));