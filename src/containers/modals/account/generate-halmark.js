/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import classNames from 'classnames';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import {Form, Text, TextArea} from 'react-form'
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import InfoBox from "../../components/info-box";
import ModalBody from "../../components/modals/modal-body";
import TabContaier from "../../components/tabulator/tab-container";
import TabulationBody from "../../components/tabulator/tabuator-body";
import TextualInputComponent from "../../components/form-components/textual-input";
import CustomTextArea from "../../components/form-components/text-area";
import AccountRSFormInput from "../../components/form-components/account-rs";


class GenerateHallmark extends React.Component {
    getNowDate = () => {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        mm = mm > 9 ? mm : `0${mm}`;
        dd = dd > 9 ? dd : `0${dd}`;

        return {
            viewDate: `${yyyy}.${mm}.${dd}`,
            postDate: `${yyyy}-${mm}-${dd}`
        }
    };

    state = {
        activeTab: 0,
        hallmark: false,
        nowDate: this.getNowDate(),
        parsedHallmark: false,
    };

    handleChangeTab = (e, index) => {
        this.setState({
            activeTab: index
        })
    };

    handleFormSubmit = async values => {
        let res = null;

        this.setState({
            hallmark: false,
            isPending: true
        });

        switch (this.state.activeTab) {
            case 0://generate hallmark
                res = await this.props.submitForm({
                    host: values.hostGenerate,
                    weight: values.weightGenerate,
                    date: values.dateGenerate,
                    secretPhrase: values.secretPhrase,
                    feeATM: 0,
                }, 'markHost');
                if (res && res.errorCode) {
                    this.setState({
                        isPending: false
                    });
                    NotificationManager.error(res.errorDescription, "Error", 5000)
                } else {
                    this.setState({
                        isPending: false,
                        hallmark: res.hallmark
                    });
                }
                break;
            case 1://parse hallmark
                res = await this.props.submitForm({
                    hallmark: values.hallmarkParse,
                    account: values.accountParse,
                    host: values.hostParse,
                    port: values.portParse,
                    date: values.dateParse,
                    valid: values.validParse,
                    feeATM: 0,
                    random: Math.random()
                }, 'decodeHallmark');
                if (res && res.errorCode) {
                    this.setState({
                        isPending: false
                    });
                    NotificationManager.error(res.errorDescription, "Error", 5000)
                } else {
                    this.setState({
                        isPending: false,
                        parsedHallmark: res
                    });
                    NotificationManager.success("Hallmark parsed", null, 5000);
                }
                break;
            default:
                break;
        }
    };

    set = false;

    render() {

        return (
            <ModalBody
                modalTitle={'Generate Hallmark'}
                closeModal={this.props.closeModal}
                isDisableFormFooter
                isDisableSecretPhrase
            >
                <TabulationBody
                    className={'p-0'}
                    onChange={this.handleChangeTab}
                >
                    <TabContaier sectionName={'Generate hallmark'}>
                        <ModalBody
                            closeModal={this.props.closeModal}
                            handleFormSubmit={(values) => this.handleFormSubmit(values)}
                            className={'p-0 transparent gray-form'}
                            isDisabe2FA
                            isPour
                            submitButtonName={'Generate'}
                        >
                            <TextualInputComponent
                                label={'Host'}
                                field="hostGenerate"
                                placeholder="Public Host Address"
                                type={"text"}
                            />
                            <TextualInputComponent
                                label={'Weight'}
                                field="weightGenerate"
                                placeholder="Proportional Weight [0-1000000000]"
                                type={"text"}
                            />
                            <div className="form-group mb-15">
                                <label>Date</label>
                                <div>
                                    {this.state.nowDate.viewDate}
                                    <Text
                                        type="hidden"
                                        field={'dateGenerate'}
                                        defaultValue={this.state.nowDate.postDate}
                                    />
                                </div>
                            </div>
                            {this.state.hallmark && (
                                <InfoBox info>
                                    {this.state.hallmark}
                                </InfoBox>
                            )}
                        </ModalBody>
                    </TabContaier>
                    <TabContaier sectionName={'Parse hallmark'}>
                        <ModalBody
                            closeModal={this.props.closeModal}
                            handleFormSubmit={(values) => this.handleFormSubmit(values)}
                            className={'p-0 transparent gray-form'}
                            isDisabe2FA
                            isPour
                            isDisableSecretPhrase
                            submitButtonName={'Parse'}
                        >
                            <CustomTextArea
                                label={'Hallmark'}
                                field={'hallmarkParse'}
                                placeholder={'Hallmark'}
                            />
                            <AccountRSFormInput
                                field={'accountParse'}
                                label={'Account'}
                                placeholder={'Account'}
                                defaultValue={this.state.parsedHallmark ? this.state.parsedHallmark.accountRS : ''}
                            />
                            <TextualInputComponent
                                label={'Host'}
                                field="hostParse"
                                placeholder="Host"
                                type={"text"}
                                defaultValue={this.state.parsedHallmark ? this.state.parsedHallmark.host : ''}
                            />
                            <TextualInputComponent
                                label={'Port'}
                                field="portParse"
                                placeholder="Port"
                                type={"text"}
                                defaultValue={this.state.parsedHallmark ? this.state.parsedHallmark.port : ''}
                            />
                            <TextualInputComponent
                                label={'Weight'}
                                field="weightParse"
                                placeholder="Weight"
                                type={"text"}
                                defaultValue={this.state.parsedHallmark ? this.state.parsedHallmark.weight : ''}
                            />
                            <TextualInputComponent
                                label={'Date'}
                                field="dateParse"
                                placeholder="Date"
                                type={"text"}
                                defaultValue={this.state.parsedHallmark ? this.state.parsedHallmark.date : ''}
                            />
                            <TextualInputComponent
                                label={'Valid'}
                                field="validParse"
                                placeholder="Valid"
                                type={"text"}
                                defaultValue={this.state.parsedHallmark ? this.state.parsedHallmark.valid.toString() : ''}
                            />
                        </ModalBody>
                    </TabContaier>
                </TabulationBody>
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),

});

export default connect(mapStateToProps, mapDispatchToProps)(GenerateHallmark);
