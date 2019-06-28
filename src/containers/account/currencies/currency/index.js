/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {getCurrencyTypes} from "../../../../modules/currencies";

const Currency = (props) =>  {
    const {currency, code, type, types, decimals, setBodyModalParamsAction, currentSupply, maxSupply, name} = props;
    const currencyTypes = getCurrencyTypes(type);

    return (
        <tr>
            <td className="blue-link-text">
                <a onClick={() => setBodyModalParamsAction('INFO_TRANSACTION', currency)}>
                    {code}
                </a>
            </td>
            <td>{name}</td>
            
            <td className="" dangerouslySetInnerHTML={{__html: currencyTypes}} />
            <td className="align-right">{currentSupply / Math.pow(10, decimals)}</td>
            <td className="align-right">{maxSupply / Math.pow(10, decimals)}</td>
            <td className="align-right">
                <div className="btn-box inline">
                    <Link to={"/exchange-booth/" + code} className="btn btn-default">Exchange</Link>
                    <button
                        type={'button'}
                        onClick={() => setBodyModalParamsAction('RESERVE_CURRENCY', props)}
                        className={`btn btn-default ${types.includes('RESERVABLE') ? '' : 'disabled'}`}
                    >
                        Reserve
                    </button>
                </div>
            </td>
        </tr>
    )
}


const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(null, mapDispatchToProps)(Currency);