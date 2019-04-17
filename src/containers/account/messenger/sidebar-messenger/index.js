import React from 'react';
import {formatTimestamp} from "../../../../helpers/util/time";
import {connect} from 'react-redux';
import {BlockUpdater} from "../../../block-subscriber/index";
import {getChatsPerPage, getChatHistory} from "../../../../actions/messager";
import {withRouter} from 'react-router-dom';

import SidebarContent from '../../../components/sidebar-list';
import SidebarMessage from './sidebar-item';

class SidebarMessages extends React.Component {
    
    render () {

        const {chats} = this.props;
        
        return (
            <SidebarContent
                baseUrl={'/messenger/'}
                element={'accountRS'}
                data={chats}
                emptyMessage={'No chats found.'}
                Component={SidebarMessage}
            />
        )
    }
}

// dangerouslySetInnerHTML={{__html: bottomBarPreText + el.currentSupply / Math.pow(10, el.decimals)}}


const mapStateToProps = state => ({
	account: state.account.account,
    chats: state.messages.chats
});

const madDispatchToProps = dispatch => ({
    formatTimestamp: (time) => dispatch(formatTimestamp(time))
})

export default connect(mapStateToProps, madDispatchToProps)(withRouter(SidebarMessages));