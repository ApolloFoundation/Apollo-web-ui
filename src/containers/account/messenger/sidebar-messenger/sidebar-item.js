import React from 'react';
import {connect} from 'react-redux';
import {formatTimestamp} from "helpers/util/time";

const SidebarMessage = (el) => (
    <div className="chat-box-item">
        <div className="chat-box-rs">
            {el.accountRS}
        </div>
        <div className="chat-date">
            {el.formatTimestamp(el.lastMessageTime)}
        </div>
    </div>
)

const madDispatchToProps = dispatch => ({
    formatTimestamp: (time) => dispatch(formatTimestamp(time))
})

export default connect(null, madDispatchToProps)(SidebarMessage);