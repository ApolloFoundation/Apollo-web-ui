import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import classNames from 'classnames';

import { Form, Text, TextArea, Checkbox } from 'react-form';
import InfoBox from '../../components/info-box';

class DeviceSettings extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }

    async handleFormSubmit(values) {
        const isPassphrase = await this.props.validatePassphrase(values.secretPhrase);

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
        if (!isPassphrase) {
            this.setState({
                ...this.props,
                passphraseStatus: true
            })
            return;
        } else {
            this.setState({
                ...this.props,
                passphraseStatus: false
            })
        }

        this.props.sendTransaction(values);
        this.props.setBodyModalParamsAction(null, {});
        this.props.setAlert('success', 'Transaction has been submitted!');
    }

    handleTabChange(tab) {
        this.setState({
            ...this.props,
            activeTab: tab
        })
    }

    handleAdvancedState() {
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
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Device Settings</p>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Data</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <div className="input-group align-middle display-block offset-bottom">
                                                    <Checkbox style={{display: 'inline-block'}} type="checkbox" field="isMessage"/>
                                                    <label style={{display: 'inline-block'}}>Check remember me checkbox</label>
                                                </div>
                                                <div className="input-group align-middle display-block offset-bottom">
                                                    <Checkbox style={{display: 'inline-block'}} type="checkbox" field="isMessage"/>
                                                    <label style={{display: 'inline-block'}}>Store remembered passphrase</label>
                                                </div>
                                                <div className="input-group align-middle display-block offset-bottom">
                                                    <Checkbox style={{display: 'inline-block'}} type="checkbox" field="isMessage"/>
                                                    <label style={{display: 'inline-block'}}>Simulate mobile app</label>
                                                </div>
                                                <div className="input-group align-middle display-block offset-bottom">
                                                    <Checkbox style={{display: 'inline-block'}} type="checkbox" field="isMessage"/>
                                                    <label style={{display: 'inline-block'}}>Connect to Testnet</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Remote node address</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <Text field="feeATM" placeholder="Amount" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Remote node port</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <Text field="feeATM" placeholder="Amount" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <div className="input-group align-middle display-block">
                                                    <Checkbox style={{display: 'inline-block'}} type="checkbox" field="isMessage"/>
                                                    <label style={{display: 'inline-block'}}>Use https</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Number of data validators</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <Text field="feeATM" placeholder="Amount" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Number of bootstrap nodes</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <Text field="feeATM" placeholder="Amount" />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="btn-box align-buttons-inside absolute right-conner">
                                    <a onClick={() => this.props.closeModal()} className="btn btn-right round round-top-left">Cancel</a>
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Send
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
    setModalData: (data) => dispatch(setModalData(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSettings);
