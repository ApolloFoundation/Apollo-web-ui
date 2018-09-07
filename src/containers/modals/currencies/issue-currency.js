import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import {Form, Text, TextArea, Number, Checkbox} from 'react-form';

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
        // Todo: finish form validating


        let type;

        switch(values) {
            case(values.type1):
                type = 1;
                delete values.type1;
                return;
            case(values.type2):
                type = 2;
                delete values.type2;
                return;
            case(values.type3):
                type = 3;
                delete values.type3;
                return;
            case(values.type4):
                type = 4;
                delete values.type4;
                return;
            case(values.type5):
                type = 5;
                delete values.type5;
                return;
            case(values.type6):
                type = 6;
                delete values.type6;
                return;

            default:
                type = 1;
                delete values.type1;
        }

        values = {
            ...values,
            type: type

        };

        this.props.submitForm(null, null, values, 'issueCurrency')
            .done((res) => {
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.setBodyModalParamsAction(null, {});

                    NotificationManager.success('Issue currency request has been submitted!', null, 5000);

                }
            })
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
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({ submitForm, values, addValue, removeValue }) => (

                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Issue Currency</p>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Currency Name</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text type="text" field="name" placeholder="Currency Name"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Currency Code</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text type="text" field='code' placeholder="Currency Code"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Description</label>
                                        </div>
                                        <div className="col-md-9">
                                            <TextArea placeholder="Description" field="description" cols="30" rows="10" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Type</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="form-sub-actions">
                                                <div
                                                    className="form-group-app no-padding-bottom no-padding-top"
                                                    style={{paddingTop: 0}}
                                                >
                                                    <div className="input-group-app align-middle display-block offset-bottom">
                                                        <Checkbox field={'type1'}/>
                                                        <label>Exchangeable</label>
                                                    </div>
                                                    <div className="input-group-app align-middle display-block offset-bottom">
                                                        <Checkbox field={'type2'}/>
                                                        <label>Controllable</label>
                                                    </div>
                                                    <div className="input-group-app align-middle display-block offset-bottom">
                                                        <Checkbox field={'type3'}/>
                                                        <label>Reservable</label>
                                                    </div>
                                                    <div className="input-group-app align-middle display-block offset-bottom">
                                                        <Checkbox field={'type4'}/>
                                                        <label>Claimable</label>
                                                    </div>
                                                    <div className="input-group-app align-middle display-block offset-bottom">
                                                        <Checkbox field={'type5'}/>
                                                        <label>Mintable</label>
                                                    </div>
                                                    <div className="input-group-app align-middle display-block offset-bottom">
                                                        <Checkbox field={'type6'}/>
                                                        <label>Non-Shuffleable</label>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Initial Supply</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text type="number" field='initialSupply' placeholder="Currency Code"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Total Supply</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text type="number" field='maxSupply' placeholder="Currency Code"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Decimals</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text type="number" field='decimals' placeholder="Currency Code"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Fee</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text type="text" field='feeATM' placeholder="Fee" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Passphrase</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text type="password" field='secretPhrase' placeholder="Passphrase" />
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Issue currency
                                    </button>
                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </a>

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
                                <AdvancedSettings advancedState={this.state.advancedState}/>
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
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IssueCurrency);
