import React from 'react';
import {Link} from 'react-router-dom';
import uuid from 'uuid';
import {connect} from 'react-redux';
import {formatTimestamp} from '../../../../helpers/util/time';

const Trade = ({quantityATU, tradeType, timestamp, asset, decimals, priceATM, name, formatTimestamp, closeModal}) => (
    <tr key={uuid()}>
        <td className={'blue-link-text'}>
            <Link
                // onClick={() => this.props.closeModal()}
                to={'/asset-exchange/' + asset}
            >
                {name}
            </Link>
        </td>
        <td>{formatTimestamp(timestamp)}</td>
        <td>{tradeType}</td>
        <td className="align-right">{quantityATU / Math.pow(10, decimals)}</td>
        <td className="align-right">{(priceATM * Math.pow(10, decimals)) / 100000000}</td>
        <td className="align-right">{(quantityATU / Math.pow(10, decimals)) * ((priceATM * Math.pow(10, decimals)) / 100000000)}</td>
    </tr>
)

const mapStateToProps = dispatch => ({
    formatTimestamp: (time) => dispatch(formatTimestamp(time))
});

export default connect(null, mapStateToProps)(Trade);