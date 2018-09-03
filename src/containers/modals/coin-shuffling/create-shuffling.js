import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import CustomSelect from '../../components/select/'
import {Form, Text} from 'react-form';
import {getBlockAction} from "../../../actions/blocks";
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";

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

        values = {
            ...values,
            registrationPeriod: 1439
        };

        this.props.submitForm(null, null, values, 'shufflingCreate')
            .done((res) => {
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.setBodyModalParamsAction(null, {});

                    NotificationManager.success('Shuffling Created!', null, 5000);
                }
            })

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
                        <form className="modal-form" onSubmit={submitForm}>
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
                                            <label>Participant Count</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field={'participantCount'} placeholder={'Participant Count'} type="text"/>
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
                                            <Text placeholder={'Secret phrase'} type={'password'} field={'secretPhrase'}/>
                                        </div>
                                    </div>
                                </div>
                                <AdvancedSettings advancedState={this.state.advancedState}/>
                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    <button
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Create Shuffling
                                    </button>

                                </div>
                                <div className="btn-box align-buttons-inside absolute left-conner">
                                    <a
                                        onClick={this.handleAdvancedState}
                                        className="btn btn-right round round-bottom-left round-top-right absolute"
                                        style={{left : 0, right: 'auto'}}
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
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    setModalData: (data) => dispatch(setModalData(data)),
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateShuffling);
