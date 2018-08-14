import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'

class IssueCurrency extends React.Component {
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
        const isPassphrase = await this.props.validatePassphrase(values.secretPhrase);

        if (!values.recipient) {
            this.setState({
                ...this.props,
                recipientStatus: true
            });
            return;
        } else {
            this.setState({
                ...this.props,
                recipientStatus: false
            });
        }
        if (!values.amountATM) {
            this.setState({
                ...this.props,
                amountStatus: true
            });
            return;
        } else {
            this.setState({
                ...this.props,
                amountStatus: false
            });
        }
        if (!values.feeATM) {
            this.setState({
                ...this.props,
                feeStatus: true
            });
            return;
        } else {
            this.setState({
                ...this.props,
                feeStatus: false
            });
        }
        if (!isPassphrase) {
            this.setState({
                ...this.props,
                passphraseStatus: true
            });
            return;
        } else {
            this.setState({
                ...this.props,
                passphraseStatus: false
            });
        }

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
                    <div className="form-group">
                        <div className="form-title">
                            <p>Issue Currency</p>
                        </div>
                        <div className="input-group display-block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Asset name</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                </div>
                            </div>
                        </div>
                        <div className="input-group display-block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Description</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                </div>
                            </div>
                        </div>
                        <div className="input-group display-block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Quantity</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                </div>
                            </div>
                        </div>
                        <div className="input-group display-block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Decimals</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                </div>
                            </div>
                        </div>
                        <div className="input-group display-block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Fee</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                </div>
                            </div>
                        </div>
                        <div className="input-group display-block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Passphrase</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
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

                        {
                            this.state.passphraseStatus &&
                            <InfoBox danger mt>
                                Incorrect passphrase.
                            </InfoBox>
                        }
                        {
                            this.state.recipientStatus &&
                            <InfoBox danger mt>
                                Incorrect recipient.
                            </InfoBox>
                        }
                        {
                            this.state.amountStatus &&
                            <InfoBox danger mt>
                                Missing amount.
                            </InfoBox>
                        }
                        {
                            this.state.feeStatus &&
                            <InfoBox danger mt>
                                Missing fee.
                            </InfoBox>
                        }

                        <AdvancedSettings advancedState={this.state.advancedState}/>
                        <div className="btn-box align-buttons-inside absolute left-conner">
                            <a
                                onClick={this.handleAdvancedState}
                                className="btn btn-right round round-bottom-left round-top-right"
                            >
                                Advanced
                            </a>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(IssueCurrency);
