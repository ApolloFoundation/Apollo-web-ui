import React from 'react';
import {formatTimestamp} from "../../../../helpers/util/time";
import {connect} from 'react-redux';

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

// dangerouslySetInnerHTML={{__html: bottomBarPreText + el.currentSupply / Math.pow(10, el.decimals)}}

const madDispatchToProps = dispatch => ({
    formatTimestamp: (time) => dispatch(formatTimestamp(time))
})

export default connect(null, madDispatchToProps)(SidebarMessage);