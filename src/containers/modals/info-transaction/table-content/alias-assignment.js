import React, {Component} from "react";


export default class AliasAssignment extends Component {
    render() {
        return (
            <React.Fragment>
                {this.props.transaction.attachment.hasOwnProperty("alias") &&
                <tr>
                    <td>Alias:</td>
                    <td>{this.props.transaction.attachment.alias}</td>
                </tr>
                }
                {this.props.transaction.senderRS &&
                <tr>
                    <td>Sender:</td>
                    <td>{this.props.transaction.senderRS}</td>
                </tr>
                }
                {this.props.transaction.senderRS &&
                <tr>
                    <td>Data:</td>
                    <td><a href={this.props.transaction.attachment.uri} target={"_blank"} rel="noopener noreferrer" >{this.props.transaction.attachment.uri}</a></td>
                </tr>
                }
            </React.Fragment>
        );
    }
}