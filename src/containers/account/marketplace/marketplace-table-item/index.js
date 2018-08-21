import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from "../../../../modules/modals";

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

const MarketplaceTableItem = (props) => (
    <tr>
        <td>{props.name}</td>
        <td className="align-right"><a>{props.quantity}</a></td>
        <td className="align-right">{Math.floor(props.priceATM / 100000000).toLocaleString('it')} APL</td>
        <td className="align-right">
            <div className="btn-box inline">
                <a
                    onClick={props.editAlias}
                    className="btn primary blue"
                >
                    Change Price
                </a>
                <a
                    className="btn primary blue"
                    onClick={props.transferAlias}
                >
                    Change QTY
                </a>
                <a
                    className="btn primary"
                    onClick={props.deleteAlias}
                >
                    Delete
                </a>
            </div>
        </td>
    </tr>
);

export default connect(null, mapDispatchToProps)(MarketplaceTableItem);