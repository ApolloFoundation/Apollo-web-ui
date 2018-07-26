import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import classNames from 'classnames';

class InfoTransactions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0
        };

        this.handleTab = this.handleTab.bind(this);
    }

    handleTab(e, index) {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
    }

    componentDidMount() {
        console.log(this.props.modalData);
    }

    // TODO: migrate timesamp, migrate account to RS

    render() {
        return (
            <div className="modal-box wide">
                {
                    this.props.modalData &&
                    <form className="modal-form">
                        <div className="form-group">
                            <div className="form-title">
                                <p>Ledger <strong>{this.props.modalData.ledgerId}</strong> info</p>
                            </div>

                            <div className="transaction-table no-min-height">
                                <div className="transaction-table-body transparent">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Event Type:	</td>
                                                <td>{this.props.modalData.eventType}</td>
                                            </tr>
                                            <tr>
                                                <td>Ledger Id:</td>
                                                <td>{this.props.modalData.ledgerId}</td>
                                            </tr>
                                            <tr>
                                                <td>Holding Type:</td>
                                                <td>{this.props.modalData.holdingType}</td>
                                            </tr>
                                            <tr>
                                                <td>Account RS:	</td>
                                                <td>{this.props.modalData.accountRS}</td>
                                            </tr>
                                            <tr>
                                                <td>Account:</td>
                                                <td>{this.props.modalData.account}</td>
                                            </tr>
                                            <tr>
                                                <td>Timestamp:</td>
                                                <td>{this.props.modalData.timestamp}</td>
                                            </tr>
                                            <tr>
                                                <td>Height:</td>
                                                <td>{this.props.modalData.height}</td>
                                            </tr>
                                            <tr>
                                                <td>Transaction:</td>
                                                <td>{this.props.modalData.event}</td>
                                            </tr>
                                            <tr>
                                                <td>Change:</td>
                                                <td>{this.props.modalData.change / 100000000}</td>
                                            </tr>
                                            <tr>
                                                <td>Balance:</td>
                                                <td>{Math.round(this.props.modalData.balance / 100000000)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <a  onClick={this.props.handleCloseModal.bind(this, 'close')} type="submit" className="btn btn-right">Close</a>

                    </form>
                }

            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoTransactions);
