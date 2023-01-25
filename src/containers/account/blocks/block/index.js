/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {formatTimestamp} from "../../../../helpers/util/time";

const mapStateToProps = state => ({
  decimals: state.account.decimals,
});

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class Block extends React.Component {
    constructor(props) {
        super(props);
    }

    pad = (value, size) => {
        if (typeof(size) !== "number") {
            size = 2;
        }

        while (value.toString().length < size) {
            value = "0" + value;
        }
        return value;
    };

    render () {

        const {height, totalAmountATM, timestamp, totalFeeATM, numberOfTransactions, formatTimestamp,
            setBodyModalParamsAction, generator, generatorRS, payloadLength, baseTarget, decimals} = this.props;

        return (
            <tr>
                <td className="blue-link-text">
                    <a
                        onClick={() => setBodyModalParamsAction('INFO_BLOCK', height)}
                    >
                        {height}
                    </a>
                </td>
                <td className="align-right">
                    <p>{formatTimestamp(timestamp)}</p>
                </td>
                <td className="align-right">{totalAmountATM / decimals}</td>
                <td className="align-right">{totalFeeATM    / decimals}</td>
                <td className="align-right">
                    {numberOfTransactions}
                </td>
                <td className="blue-link-text">
                    <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', generator)}>{generatorRS}</a>
                </td>
                <td className="align-right">
                    <p>{payloadLength} B</p>
                </td>
                <td className="align-right">
                    {this.pad(Math.round(baseTarget / 153722867 * 100), 4)} %
                </td>
            </tr>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Block);
