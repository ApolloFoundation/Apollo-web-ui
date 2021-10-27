import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import SidebarList from '../../../components/sidebar-list';
import SidebarMessage from './sidebar-item';

const SidebarMessages = ({chats}) => (
    <SidebarList
        baseUrl={'/messenger/'}
        element={'accountRS'}
        data={chats}
        emptyMessage={'No chats found.'}
        Component={SidebarMessage}
    />
);

const mapStateToProps = state => ({
    chats: state.messages.chats
});

export default connect(mapStateToProps)(withRouter(SidebarMessages));