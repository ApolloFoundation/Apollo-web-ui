import React from 'react';

const DescriptionTable = ({items}) => (
    <div className="transaction-table no-min-height">
        <div className="transaction-table-body transparent">
            {
                items && 
                <table>
                    <tbody>
                        {
                            items.map(el => (
                                <tr>
                                    <td>{el.title}</td>
                                    <td>{el.description}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            }
        </div>
    </div>
)

export default DescriptionTable;