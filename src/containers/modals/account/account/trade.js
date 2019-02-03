import React from 'react';
import {Link} from 'react-router-dom';
import uuid from 'uuid';

const Trade = ({quantityATU, tradeType, timestamp, asset, decimals, priceATM, name, closeModal}) => (
    <tr key={uuid()}>
        <td className={'blue-link-text'}>
            <Link
                // onClick={() => this.props.closeModal()}
                to={'/asset-exchange/' + asset}
            >
                {name}
            </Link>
        </td>
        <td>{this.props.formatTimestamp(timestamp)}</td>
        <td>{tradeType}</td>
        <td className="align-right">{quantityATU / Math.pow(10, decimals)}</td>
        <td className="align-right">{(priceATM * Math.pow(10, decimals)) / 100000000}</td>
        <td className="align-right">{(quantityATU / Math.pow(10, decimals)) * ((priceATM * Math.pow(10, decimals)) / 100000000)}</td>
    </tr>
)

export default Trade;