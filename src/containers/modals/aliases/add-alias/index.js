import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../../modules/modals';
import classNames from 'classnames';

import { Form, Text } from 'react-form';
import InfoBox from '../../../components/info-box';
import {getAliasAction} from "../../../../actions/aliases";
import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import CustomSelect from '../../../components/select';

class AddAlias extends React.Component {
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
            feeStatus: false,
        };

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }


    async handleFormSubmit(values) {

        this.props.submitForm(null, null, values, 'setAlias')
            .done((res) => {
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.setBodyModalParamsAction(null, {});

                    NotificationManager.success('Product has been listed!', null, 5000);
                }
            })

        // this.props.sendTransaction(values);
        // this.props.setBodyModalParamsAction(null, {});
        // this.props.setAlert('success', 'Transaction has been submitted!');
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

    handleTab = (e, index) => {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
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
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Add Alias</p>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Type</label>
                                        </div>
                                        <div className="col-md-9">
                                            <CustomSelect
                                                field={'type'}
                                                setValue={setValue}
                                                options={[
                                                    { value: 'uri',     label: 'URI' },
                                                    { value: 'account', label: 'Account' },
                                                    { value: 'general', label: 'Other' },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Alias</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field="aliasName" placeholder="Alias name" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>URI</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field="aliasURI" placeholder="http://"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Fee</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field="feeATM" placeholder="Amount" type={'number'}/>
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
                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Update
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
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddAlias);
