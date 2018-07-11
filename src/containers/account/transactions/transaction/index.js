import React from 'react';
import uuid from 'uuid';

class Transaction extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <tr key={uuid()}>
                <td className="blue-link-text">
                    <a>{this.props.transaction.date}</a>
                </td>
                <td>

                </td>
                <td className="align-right">
                    {this.props.transaction.amount}
                </td>
                <td className="align-right">

                </td>
                <td className="blue-link-text">
                    <a>{this.props.transaction.account}</a>
                </td>
                <td className="align-right">
                    {this.props.transaction.phasing}
                </td>
                <td className="align-right blue-link-text">
                    <a>{this.props.transaction.height}</a>
                </td>
                <td className="align-right">
                    <a>{this.props.transaction.confirmations}</a>
                </td>
            </tr>
        );
    }
}

export default Transaction;