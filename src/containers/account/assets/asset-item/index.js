import React from 'react';
import {connect} from 'react-redux';

import {setBodyModalParamsAction} from "../../../../modules/modals";

import {Link} from 'react-router-dom';

const AssetItem = (
    {
        asset, 
        accountRS,
        account,
        name, 
        numberOfAccounts, 
        decimals, 
        initialQuantityATU, 
        quantityATU, 
        numberOfTransfers, 
        numberOfTrades,

        setBodyModalParamsAction
    }) => {

    const initialSupply = initialQuantityATU / Math.pow(10, decimals);
    const totalSupply   = quantityATU / Math.pow(10, decimals);

    return (
        (
            <tr>
                <td className={'blue-link-text'}>
                    <Link to={`/asset-exchange/${asset}`}>
                        {name}
                    </Link>
                </td>
                <td className={'blue-link-text'}>
                    <a
                        onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', account)}
                    >
                        {accountRS}
                    </a>
                </td>
                <td className={'align-right'}>{numberOfAccounts}</td>
                <td className={'align-right'}>{numberOfTransfers}</td>
                <td className={'align-right'}>{numberOfTrades}</td>
                <td className={'align-right'}>{initialSupply}</td>
                <td className={'align-right'}>{totalSupply}</td>
            </tr>
        )
    )
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});


export default connect(null, mapDispatchToProps)(AssetItem)