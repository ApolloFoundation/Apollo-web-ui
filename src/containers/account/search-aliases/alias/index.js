/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';

const Alias = (props) => (
    <tr>
        <td>{props.aliasName}</td>
        <td>{props.aliasURI}</td>
        {
            props.priceATM &&
            props.priceATM === '0' &&
            props.userAccount === props.buyer &&
            <td>CANCELLING SALE</td>
        }
        {
            props.priceATM &&
            props.priceATM === '0' &&
            props.userAccount !== props.buyer &&
            <td>TRANSFER IN PROGRESS</td>
        }
        {
            props.priceATM &&
            props.priceATM !== '0' &&
            typeof props.buyer !== "undefined" &&
            <td>FOR SALE (DIRECT)</td>
        }
        {
            props.priceATM &&
            props.priceATM !== '0' &&
            !props.buyer &&
            <td>FOR SALE (INDIRECT)</td>
        }
        {
            !props.priceATM &&
            <td>REGISTERED</td>
        }

    </tr>
);

export default Alias;