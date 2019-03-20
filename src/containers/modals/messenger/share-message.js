import React from "react";
import {connect} from "react-redux";
import {Checkbox, Form, Text} from "react-form";
import InputForm from "../../components/input-form";
import ModalFooter from "../../components/modal-footer";
import {setBodyModalParamsAction} from "../../../modules/modals";

import FormFooter from '../../components/form-components/form-footer';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {NotificationManager} from "react-notifications";

class ShareMessage extends React.Component {
    render() {
        const data = this.props.modalData;
        const lnik = `${window.location.protocol}//${window.location.host}?isShareMessage=true&account=${this.props.account}&transaction=${data.transaction}`

        return (
            <div className="modal-box x-wide">
                        <div className="modal-form">
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>
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
                                                            onClick={() => setBodyModalParamsAction('INFO_TRANSACTION', data.transaction)}
                                                            className={'blue-link-text'}
                                                        >
                                                            {data.transaction}
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Share Link:</td>
                                                    <td className={'no-white-space'}>
                                                        <div className={'d-md-flex d-sm-dlock'}>

                                                            <a 
                                                                className={'blue-text'}
                                                                href={lnik}
                                                                rel="noopener noreferrer"
                                                                target="_blank">
                                                                {lnik}
                                                            </a>

                                                            <CopyToClipboard
                                                                text={lnik}
                                                                onCopy={() => {
                                                                    NotificationManager.success('The share link has been copied to clipboard.')
                                                                }}
                                                            >
                                                                <a
                                                                    className="btn blue user-account-rs ml-md-3 mt-md-0 mt-sm-3 b-inline-block"
                                                                >
                                                                    Copy to clipboard
                                                                </a>
                                                            </CopyToClipboard>
                                                        </div>
                                                        
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <FormFooter 
                                        closeModal={() => this.props.closeModal()}
                                    />
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