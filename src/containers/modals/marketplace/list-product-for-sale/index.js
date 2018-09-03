import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../../modules/modals';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import AdvancedSettings from '../../../components/advanced-transaction-settings'
import InfoBox from '../../../components/info-box'
import {Form, Text, TextArea, Number} from 'react-form';
import crypto from '../../../../helpers/crypto/crypto';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {setAlert} from "../../../../modules/modals";
import submitForm from "../../../../helpers/forms/forms";

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    setAlert: (type, message) => dispatch(setAlert(type, message)),
    validatePassphrase: (passPhrase) => dispatch(crypto.validatePassphrase(passPhrase))
});

class ListProductForSale extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false,
            prePreviewImage: null
        }
    }

    handleFormSubmit = async(values) => {
        // Todo: finish form validating

        this.props.submitForm(null, null, values, 'dgsListing')
            .done((res) => {
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.setBodyModalParamsAction(null, {});

                    NotificationManager.success('Product has been listed!', null, 5000);
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

    _handleImageChange = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                ...this.state,
                file: file,
                imagePreviewUrl: reader.result
            });
        };

        reader.readAsDataURL(file)
    }

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>List Product For Sale</p>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Name</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Name" field="name" type="text"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Description</label>
                                        </div>
                                        <div className="col-md-9">
                                            <TextArea placeholder="Description" field="description" cols="30" rows="10" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Tags</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Tags (categories)" field="tags" type="text"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Price</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Price" field="priceATM" type="number" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Quantity</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Quantity" field="quantity" type="number"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Image</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="iconned-input-field">
                                                <div className="input-group search">
                                                    <div className="iconned-input-field">
                                                        <div className="input-icon text"><i className="">Browse&hellip;</i></div>
                                                        <input
                                                            id="file"
                                                            type="file"
                                                            placeholder="Recipient"
                                                            onChange={(e) => {
                                                                e.preventDefault();

                                                                let reader = new FileReader();
                                                                let file = e.target.files[0];

                                                                reader.onloadend = () => {
                                                                    this.setState({
                                                                        ...this.state,
                                                                        file: file,
                                                                        imagePreviewUrl: reader.result
                                                                    });
                                                                };

                                                                setValue("messageIsText", false);
                                                                setValue("messageIsPrunable", true);

                                                                reader.readAsDataURL(file);

                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                            {/*<Text placeholder="Fee" field="feeATM" type="text"/>*/}
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                        </div>
                                        <div className="col-md-9">
                                            {
                                                !this.state.imagePreviewUrl &&
                                                <div className="no-image">
                                                    <i className="zmdi zmdi-image" />
                                                </div>
                                            }
                                            {
                                                this.state.imagePreviewUrl &&
                                                <img className="preview-image" src={this.state.imagePreviewUrl} alt=""/>
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
                                            <Text placeholder="Minimum fee" field={'feeATM'} type="number"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group display-block offset-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Passphrase</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text placeholder="Passphrase" field={'secretPhrase'}  type={'password'}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-box align-buttons-inside absolute right-conner">
                                    <button className="btn btn-right round round-top-left">Cancel</button>
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn absolute btn-right blue round-top-left round-bottom-right"
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

export default connect(mapStateToProps, mapDispatchToProps)(ListProductForSale);
