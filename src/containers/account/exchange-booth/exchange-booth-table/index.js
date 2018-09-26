/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import classNames from 'react'

const ExchangeBoothTable = (props) => (
    <div className="transaction-table">
        <div className="transaction-table-body">
            <table>
                <thead>
                <tr>
                    <td>Account</td>
                    <td className="align-right">Units</td>
                    <td className="align-right">Limit</td>
                    <td>Rate</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Alias_name_1</td>
                    <td className="blue-link-text">9,999,995</td >
                    <td className="blue-link-text">10,999,995</td>
                    <td>10</td>
                </tr>

                </tbody>
            </table>
        </div>
    </div>

);

export default ExchangeBoothTable;