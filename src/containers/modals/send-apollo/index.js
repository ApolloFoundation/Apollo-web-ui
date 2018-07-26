import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import {sendTransactionAction} from '../../../actions/transactions';

import classNames from 'classnames';
import crypto from  '../../../helpers/crypto/crypto';


import {Form, Text} from 'react-form';
import InfoBox from '../../components/info-box';

class SendApollo extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false
        }

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }

    handleFormSubmit(values) {
        console.log(values);

        this.props.sendTransaction(values);
    }

    handleTabChange(tab) {
        this.setState({
            ...this.props,
            activeTab: tab
        })
    }

    handleAdvancedState() {
        console.log(this.state.advancedState);
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
    }

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                         submitForm
                    }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group">
                                <div className="form-title">
                                    <p>Send Apollo</p>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Recipient</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field="recipient" placeholder="Recipient" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Amount</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field="amountATM" placeholder="Amount" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Fee</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field="feeATM" placeholder="Amount" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Passphrase</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field="secretPhrase" placeholder="secretPhrase" />
                                        </div>
                                    </div>
                                </div>
                                <InfoBox danger mt>
                                    Incorrect passphrase.
                                </InfoBox>
                                <div
                                    className={classNames({
                                        'form-tabulator': true,
                                        'active': this.state.advancedState
                                    })}
                                >
                                    <div className="form-tab-nav-box">
                                        <a
                                            onClick={this.handleTabChange.bind(this, 0)}
                                            className={classNames({
                                                'form-tab': true,
                                                'active' : this.state.activeTab === 0
                                            })}
                                        >
                                            <i className={'zmdi zmdi-close-circle'}></i>
                                        </a>
                                        <a
                                            onClick={this.handleTabChange.bind(this, 1)}
                                            className={classNames({
                                                'form-tab': true,
                                                'active' : this.state.activeTab === 1
                                            })}
                                        >
                                            <i className={'zmdi zmdi-image-alt'}></i>
                                        </a>

                                        <a
                                            onClick={this.handleTabChange.bind(this, 2)}
                                            className={classNames({
                                                'form-tab': true,
                                                'active' : this.state.activeTab === 2
                                            })}
                                        >
                                            <i className={'zmdi zmdi-accounts-alt'}></i>
                                        </a>
                                        <a
                                            onClick={this.handleTabChange.bind(this, 3)}
                                            className={classNames({
                                                'form-tab': true,
                                                'active' : this.state.activeTab === 3
                                            })}
                                        >
                                            <i className={'zmdi zmdi-money-box'}></i>
                                        </a>
                                        <a
                                            onClick={this.handleTabChange.bind(this, 4)}
                                            className={classNames({
                                                'form-tab': true,
                                                'active' : this.state.activeTab === 4
                                            })}
                                        >
                                            <i className={'zmdi zmdi-image-alt'}></i>
                                        </a>
                                        <a
                                            onClick={this.handleTabChange.bind(this, 5)}
                                            className={classNames({
                                                'form-tab': true,
                                                'active' : this.state.activeTab === 5
                                            })}
                                        >
                                            <i className={'zmdi zmdi-image-alt'}></i>
                                        </a>
                                        <a
                                            onClick={this.handleTabChange.bind(this, 5)}
                                            className={classNames({
                                                'form-tab': true,
                                                'active' : this.state.activeTab === 5
                                            })}
                                        >
                                            <i className={'zmdi zmdi-image-alt'}></i>
                                        </a>
                                        <a
                                            onClick={this.handleTabChange.bind(this, 5)}
                                            className={classNames({
                                                'form-tab': true,
                                                'active' : this.state.activeTab === 5
                                            })}
                                        >
                                            <i className={'zmdi zmdi-image-alt'}></i>
                                        </a>

                                    </div>
                                    <div className="form-tab">
                                        <div className="input-group">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Referenced transaction hash</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                                </div>
                                                <div className="col-md-3">

                                                </div>
                                                <div className="col-md-9">
                                                    <div className="form-sub-actions">
                                                        <div className="form-group">
                                                            <div className="input-group align-middle display-block offset-top">
                                                                <input type="checkbox"/>
                                                                <label>Do not broadcast</label>
                                                            </div>
                                                            <div className="input-group align-middle display-block offset-top">
                                                                <input type="checkbox"/>
                                                                <label>Add note to self?</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-box align-buttons-inside absolute right-conner">
                                    <button className="btn btn-right round round-top-left">Cancel</button>
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Send
                                    </button>

                                </div>
                                <div className="btn-box align-buttons-inside absolute left-conner">
                                    <button
                                        onClick={this.handleAdvancedState}
                                        className="btn btn-right round round-bottom-left round-top-right"
                                    >
                                        Advanced
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                >

                </Form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    sendTransaction: (requestParams) => dispatch(sendTransactionAction(requestParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase))
});

export default connect(mapStateToProps, mapDispatchToProps)(SendApollo);
