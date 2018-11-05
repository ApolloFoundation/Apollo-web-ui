/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'

class ReserveCurrency extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

    }

    handleFormSubmit = async(values) => {
        if (!values.recipient) {
            this.setState({
                ...this.props,
                recipientStatus: true
            })
            return;
        } else {
            this.setState({
                ...this.props,
                recipientStatus: false
            })
        }
        if (!values.amountATM) {
            this.setState({
                ...this.props,
                amountStatus: true
            })
            return;
        } else {
            this.setState({
                ...this.props,
                amountStatus: false
            })
        }
        if (!values.feeATM) {
            this.setState({
                ...this.props,
                feeStatus: true
            })
            return;
        } else {
            this.setState({
                ...this.props,
                feeStatus: false
            })
        }

        this.setState({
            isPending: true
        })
        this.props.sendTransaction(values);
        this.props.setBodyModalParamsAction(null, {});
        this.props.setAlert('success', 'Transaction has been submitted!');
    };

    handleAdvancedState = () => {
        if (this.state.advancedState) {
            this.setState({
                ...this.props,
                advancedState: false
            })
        } else {
            this.setState({
                ...this.props,
                advancedState: true
            })
        }
    };

    render() {
        return (
            <div className="modal-box">
                <form className="modal-form" onSubmit={this.handleFormSubmit.bind(this)}>
                    <div className="form-group-app">
                        <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                        <div className="form-title">
                            <p>Reserve Currency</p>
                        </div>
                        <div className="input-group-app display-block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Asset</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                </div>
                            </div>
                        </div>
                        <div className="input-group-app display-block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Recipient</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                </div>
                            </div>
                        </div>
                        <div className="input-group-app display-block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Quantity</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                </div>
                            </div>
                        </div>
                        <div className="input-group-app display-block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Fee</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                </div>
                            </div>
                        </div>
                        <div className="input-group-app display-block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Secret phrase</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                </div>
                            </div>
                        </div>
                        <div className="btn-box align-buttons-inside absolute right-conner align-right">
                            {
                                !!this.state.isPending ?
                                    <div
                                        style={{
                                            width: 100
                                        }}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        <div className="ball-pulse">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </div> :
                                    <button
                                        style={{
                                            width: 100
                                        }}
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Reserve Currency
                                    </button>
                            }

                            <a
                                onClick={() => this.props.closeModal()}
                                className="btn round round-top-left"
                            >
                                Cancel
                            </a>

                        </div>
                        {/*<div className="btn-box align-buttons-inside absolute left-conner">
                            <a
                                onClick={this.handleAdvancedState}
                                className="btn btn-right round round-bottom-left round-top-right absolute"
                                style={{left : 0, right: 'auto'}}
                            >
                                Advanced
                            </a>
                        </div>*/}
                        {/*<AdvancedSettings*/}
                            {/*setState={setValue}                                     */}
                            {/*advancedState={this.state.advancedState}                                 */}
                        {/*/>*/}
                    </div>
                </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReserveCurrency);
