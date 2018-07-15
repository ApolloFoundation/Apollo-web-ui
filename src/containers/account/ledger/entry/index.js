import React from 'react';
import uuid from 'uuid';

class Entry extends React.Component {
    constructor(props) {
        super(props);
    }



    render () {
        return (
            <tr>
                <td className="blue-link-text">
                    <a>{this.props.entry.timestamp}</a>
                </td>
                <td>
                    {this.props.entry.eventType}
                    <a><span className="info"></span></a>
                </td>
                <td className="align-right">-{this.props.entry.change / 100000000}</td>
                <td>{(this.props.entry.balance / 100000000).toFixed(2)}</td>
                <td>
                    <a></a>
                </td>
                <td className="align-right">
                    <a></a>
                </td>
                <td className="align-right">
                    <a></a>
                </td>
            </tr>
        );
    }
}

export default Entry;