import React from "react";
import {connect} from "react-redux";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {NotificationManager} from "react-notifications";

class ShareMessage extends React.Component {
    render() {
        const data = this.props.modalData;
        const lnik = `${window.location.protocol}//${window.location.host}?isShareMessage=true&account=${this.props.account}&transaction=${data.transaction}`

        return (
            <div className="modal-box wide">
                <div className="modal-form">
                    <div className="form-group-app">
                        <button type="button" onClick={() => this.props.closeModal()} className="exit"><i
                            className="zmdi zmdi-close"/></button>
                        <div className="form-title">
                            <p>Share message</p>
                        </div>
                        <div className="transaction-table no-min-height transparent">
                            <div className="transaction-table-body transparent full-info">
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>Transaction:</td>
                                        <td>
                                            <a
                                                onClick={() => this.props.setBodyModalParamsAction('INFO_TRANSACTION', data.transaction)}
                                                className={'blue-link-text'}
                                            >
                                                {data.transaction}
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={'align-top'}>
                                            Share Link:
                                            <br/>
                                            <CopyToClipboard
                                                text={lnik}
                                                onCopy={() => {
                                                    NotificationManager.success('The share link has been copied to clipboard.')
                                                }}
                                            >
                                                <button
                                                    type={'button'}
                                                    className="btn btn-green mt-2"
                                                >
                                                    Copy to clipboard
                                                </button>
                                            </CopyToClipboard></td>
                                        <td>
                                            <a
                                                className={'blue-text'}
                                                href={lnik}
                                                rel="noopener noreferrer"
                                                target="_blank">
                                                {lnik}
                                            </a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.accountRS
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShareMessage);