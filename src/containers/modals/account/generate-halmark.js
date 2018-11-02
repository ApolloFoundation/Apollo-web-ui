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


class GenerateHallmark extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            hallmark: false,

            parsedHallmark: false,
        };

        this.handleTab = this.handleTab.bind(this);
    }

    handleTab(e, index) {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
    }

    handleFormSubmit = async values => {
        this.setState({
            hallmark: false
        });
        let res = null;

        this.setState({
            isPending: true
        })

        switch (this.state.activeTab) {
            case 0://generate hallmark
                res = await this.props.submitForm( {
                    host: values.hostGenerate,
                    weight: values.weightGenerate,
                    date: values.dateGenerate,
                    secretPhrase: values.passphraseGenerate,
                    feeATM: 0,
                }, 'markHost');
                if (res.errorCode) {
                    this.setState({
                        isPending: false
                    })
                    NotificationManager.error(res.errorDescription, "Error", 5000)
                } else {
                    this.setState({
                        isPending: false
                    })
                    this.setState({
                        hallmark: res.hallmark
                    })
                }
                break;
            case 1://parse hallmark
                res = await this.props.submitForm( {
                    hallmark: values.hallmarkParse,
                    account: values.accountParse,
                    host: values.hostParse,
                    port: values.portParse,
                    date: values.dateParse,
                    valid: values.validParse,
                    feeATM: 0,
                    random: Math.random()
                }, 'decodeHallmark');
                if (res.errorCode) {
                    this.setState({
                        isPending: false
                    })
                    NotificationManager.error(res.errorDescription, "Error", 5000)
                } else {
                    this.setState({
                        isPending: false
                    })
                    NotificationManager.success("Hallmark parsed", null, 5000);
                    this.setState({parsedHallmark: res})
                }
                break;
        }
    };

    set = false;

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({submitForm, setAllValues}) => {
                        if (this.state.parsedHallmark) {
                            if (!this.set) {
                                this.set = true;
                                const parsedHallmark = this.state.parsedHallmark;
                                setAllValues({
                                    accountParse: parsedHallmark.accountRS,
                                    hostParse: parsedHallmark.host,
                                    portParse: parsedHallmark.port,
                                    weightParse: parsedHallmark.weight,
                                    dateParse: parsedHallmark.date,
                                    validParse: parsedHallmark.valid ? "true" : "false",
                                })
                            }
                        }
                        return (
                            <form className="modal-form" onSubmit={submitForm}>
                                <div className="form-group-app">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i
                                        className="zmdi zmdi-close"/></a>

                                    <div className="form-title">
                                        <p>Generate Hallmark</p>
                                    </div>

                                    <div className="form-tabulator active">
                                        <div className="form-tab-nav-box justify-left">
                                            <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                                "form-tab": true,
                                                "active": this.state.activeTab === 0
                                            })}>
                                                <p>Generate hallmark</p>
                                            </a>
                                            <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                                "form-tab": true,
                                                "active": this.state.activeTab === 1
                                            })}>
                                                <p>Parse hallmark</p>
                                            </a>
                                        </div>

                                        <div className={classNames({
                                            "tab-body": true,
                                            "active": this.state.activeTab === 0
                                        })}>
                                            <div className="input-group-app block offset-bottom offset-top">

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Host</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text rows={5} type="text"
                                                              field={'hostGenerate'}
                                                              placeholder="Public Host Address"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group-app block offset-bottom">

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Weight</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text type="text" field={'weightGenerate'}
                                                              placeholder="Proportional Weight [0-1000000000]"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group-app block offset-bottom">

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Date</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text
                                                            type="date"
                                                            pattern="\d{1,2}/\d{1,2}/\d{4}"
                                                            field={'dateGenerate'}
                                                            placeholder="Date [YYYY/MM/DD]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group-app block offset-bottom">

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Secret phrase</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text type="password"
                                                              field={'passphraseGenerate'}
                                                              placeholder="Secret phrase"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="btn-box align-buttons-inside absolute right-conner">
                                                <button
                                                    type="submit"
                                                    name={'closeModal'}
                                                    className="btn btn-right blue round round-bottom-right"
                                                >
                                                    Generate
                                                </button>
                                                <a className="btn btn-right round round-top-left"
                                                   onClick={() => this.props.closeModal()}>Cancel
                                                </a>
                                            </div>
                                        </div>
                                        <div className={classNames({
                                            "tab-body": true,
                                            "active": this.state.activeTab === 1
                                        })}>
                                            <div className="input-group-app block offset-bottom offset-top">

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Hallmark</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                            <TextArea rows={5} type="text" field={'hallmarkParse'}
                                                                      placeholder="Hallmark"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group-app block offset-bottom">

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Account</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text rows={5} type="text" field={'accountParse'}
                                                              placeholder="Account"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group-app block offset-bottom">

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Host</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text type="text" field={'hostParse'} placeholder="Host"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group-app block offset-bottom">

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Port</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text type="text" field={'portParse'} placeholder="Port"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group-app block offset-bottom">

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Weight</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text type="text"
                                                              field={'weightParse'}
                                                              placeholder="Weight"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group-app block offset-bottom">

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Date</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text type="text"
                                                              field={'dateParse'} placeholder="Date"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group-app block offset-bottom">

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Valid</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text type="text"
                                                              field={'validParse'} placeholder="Valid"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="btn-box align-buttons-inside absolute right-conner">

                                                {
                                                    !!this.state.isPending ?
                                                        <div
                                                            style={{
                                                                width: 67.88
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

                                                            type="submit"
                                                            name={'closeModal'}
                                                            className="btn btn-right blue round round-bottom-right"
                                                        >
                                                            Parse
                                                        </button>
                                                }

                                                <a className="btn btn-right round round-top-left"
                                                   onClick={() => this.props.closeModal()}
                                                >
                                                    Cancel
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {this.state.hallmark ? <InfoBox info>
                                    {this.state.hallmark}
                                </InfoBox> : null}

                            </form>
                        );
                    }}
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
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),

});

export default connect(mapStateToProps, mapDispatchToProps)(GenerateHallmark);
