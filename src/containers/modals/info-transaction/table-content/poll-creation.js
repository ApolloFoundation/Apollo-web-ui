import React, {Component} from "react";

const votingModelData = [
    'Vote by Account',
    'Vote by Account Balance',
    'Vote by Asset Balance',
    'Vote by Currency Balance'
];

export default class PollCreation extends Component {
    render() {
        const atch = this.props.transaction.attachment;
        return (
            <React.Fragment>
                {atch.name &&
                <tr>
                    <td>Name:</td>
                    <td>{atch.name}</td>
                </tr>
                }
                {atch.description &&
                <tr>
                    <td>Description:</td>
                    <td>{atch.description}</td>
                </tr>
                }
                {atch.finishHeight &&
                <tr>
                    <td>Finish Height:</td>
                    <td>{atch.finishHeight}</td>
                </tr>
                }
                {atch.minNumberOfOptions &&
                <tr>
                    <td>Min Number of Options:</td>
                    <td>{atch.minNumberOfOptions}</td>
                </tr>
                }
                {atch.maxNumberOfOptions &&
                <tr>
                    <td>Max Number of Options:</td>
                    <td>{atch.maxNumberOfOptions}</td>
                </tr>
                }
                {atch.minRangeValue !== undefined && atch.minRangeValue !== null &&
                <tr>
                    <td>Min Range Value:</td>
                    <td>{atch.minRangeValue}</td>
                </tr>
                }
                {atch.maxRangeValue &&
                <tr>
                    <td>Max Range Value:</td>
                    <td>{atch.maxRangeValue}</td>
                </tr>
                }
                {atch.minBalance &&
                <tr>
                    <td>Minimum Balance:</td>
                    <td>{atch.minBalance}</td>
                </tr>
                }
                <tr>
                    <td>Minimum Balance Model:</td>
                    <td>{atch.minBalanceModel}</td>
                </tr>
                <tr>
                    <td>Voting Model:</td>
                    <td>{votingModelData[atch.votingModel]}</td>
                </tr>
                <tr>
                    <td>Sender:</td>
                    <td>{this.props.transaction.senderRS}</td>
                </tr>
            </React.Fragment>
        );
    }
}