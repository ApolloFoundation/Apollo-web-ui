import React from 'react';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
})

const MessageItem = (props) => (
    <tr>
        <td className="blue-link-text">{props.timestamp}</td>
        <td className="blue-link-text">
            <a onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.sender)}>{props.senderRS}</a>
        </td>
        <td className="blue-link-text">
            <a onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.recipient)}>{props.recipientRS}</a>
        </td>
        {
            props.attachment.encryptedMessage &&
            <td><i className="zmdi zmdi-alert-triangle"/>&nbsp;<span>Message is encrypted.</span></td>

        }

        {
            !props.attachment.encryptedMessage &&
            <td>{props.attachment.message}</td>
        }
        <td className="align-right">
            <div className="btn-box inline">
                <a
                    className="btn primary blue static"
                >
                    Decrypt
                </a>
            </div>
        </td>
    </tr>
);

export default connect(null, mapDispatchToProps)(MessageItem);