import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from "../../../../modules/modals";

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

const DataStorageItem  = props => (
    <tr>
        <td className="blue-link-text">
            <a onClick={() => props.getTransaction(props.transaction)}>{props.name}</a>
        </td>
        <td className="blue-link-text">
            <a onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.account)}>{props.accountRS}</a>
        </td>
        <td>{props.type}</td>
        <td>{props.channel}</td>
        <td>{props.filename}</td>
        <td className="align-right">
            <div className="btn-box inline">
                <a
                    onClick={() => props.editAlias}
                    className="btn primary blue"
                >
                    Download
                </a>
            </div>
        </td>
    </tr>
);

export default connect(null, mapDispatchToProps)(DataStorageItem);