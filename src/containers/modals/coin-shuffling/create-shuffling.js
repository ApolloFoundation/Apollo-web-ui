import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import CustomSelect from '../../components/select/'
import {Form, Text} from 'react-form';
import {getBlockAction} from "../../../actions/blocks";

class CreateShuffling extends React.Component {
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


        // this.props.sendTransaction(values);
        // this.props.setBodyModalParamsAction(null, {});
        // this.props.setAlert('success', 'Transaction has been submitted!');
    };

    componentDidMount = () => {
        this.setRegisterUntil();
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

    setRegisterUntil = async () => {
        const block = await this.props.getBlockAction();

        if (block) {
            this.setState({
                block
            });
        }
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, setValue
                             }) => (
                        <form className="modal-form" onSubmit={this.handleFormSubmit.bind(this)}>
                            <div className="form-group">
                                <div className="form-title">
                                    <p>Create shuffling</p>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Asset name</label>
                                        </div>
                                        <div className="col-md-9">
                                            <CustomSelect
                                                field={'holdingType'}
                                                setValue={setValue}
                                                options={[
                                                    { value: '0',     label: 'Apollo' },
                                                    { value: '1', label: 'Asset' },
                                                    { value: '2', label: 'Currency' },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Amount</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field={'shufflingAmountAPL'} defaultValue={0} type="number" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Register Until</label>
                                        </div>
                                        <div className="col-md-9">
                                            {
                                                this.state.block &&
                                                <Text defaultValue={this.state.block.height} field={'finishHeight'} type="number" step={10000}/>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Fee</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field={'feeAPL'} placeholder={'Amount'} type="text"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Passphrase</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder={'Secret phrase'} type="text" field={'secretPhrase'}/>
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
                    )}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateShuffling);
