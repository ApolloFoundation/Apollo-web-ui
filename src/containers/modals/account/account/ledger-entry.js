import React from 'react';
import uuid from 'uuid';
import {connect} from 'react-redux';
import {getLedgerEntryAction} from "../../../../actions/ledger";
import {formatTimestamp}      from '../../../../helpers/util/time';
import {setBodyModalParamsAction} from '../../../../modules/modals';
import {ONE_APL} from '../../../../constants';


const Entry = ({formatTimestamp, event, eventType, timestamp, change, holdingType, holdingInfo, balance, ledgerId, setBodyModalParamsAction}) => (
    <tr key={uuid()}>
        <td className="blue-link-text">
            <a
                onClick={() => setBodyModalParamsAction('INFO_LEDGER_TRANSACTION', ledgerId)}
            >
                {formatTimestamp(timestamp)}
            </a>
        </td>
        <td>
            <a
                onClick={() => setBodyModalParamsAction('INFO_TRANSACTION', event)}
            >
                {eventType}
                &nbsp;&nbsp;
                <span
                    className="zmdi zmdi-info"
                />
            </a>
        </td>
        <td className="align-right">
            {holdingType === "UNCONFIRMED_APL_BALANCE" &&
            (change / ONE_APL).toFixed(1)}
        </td>
        <td className="align-right">
            {holdingType === "UNCONFIRMED_APL_BALANCE" && balance > 0 &&
            (balance / ONE_APL).toLocaleString('en')}
        </td>
        <td className="align-right">
            {holdingInfo && holdingInfo.name}
        </td>
        <td className="align-right">
            {holdingType === "UNCONFIRMED_CURRENCY_BALANCE" &&
            holdingInfo && holdingInfo.name &&
            (change / 1).toFixed(2)}
            {holdingType === "UNCONFIRMED_ASSET_BALANCE" &&
            (change / ONE_APL).toFixed(2)}
        </td>
        <td className="align-right">
            {holdingType === "UNCONFIRMED_CURRENCY_BALANCE" &&
            holdingInfo && holdingInfo.name &&
            (balance / 1).toLocaleString('en')}
            {holdingType === "UNCONFIRMED_ASSET_BALANCE" &&
            (balance / ONE_APL).toLocaleString('en')}
        </td>
    </tr>
)

const mapDispatchToProps = dispatch => ({
    getLedgerEntryAction: (data) => getLedgerEntryAction(data),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
	setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),

})

export default connect(null, mapDispatchToProps)(Entry);
