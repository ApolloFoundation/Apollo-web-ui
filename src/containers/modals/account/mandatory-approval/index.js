/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../../modules/modals';
import classNames from 'classnames';

class MandatoryApproval extends React.Component {
    state = {
        activeTab: 0,
        advancedState: false

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
    }

    handleTab = (e, index) => {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
    }

    render() {
        return (
            <div className="modal-box">
                    <form className="modal-form">
                        <div className="form-group-app">
                            <button type="button" onClick={this.props.closeModal} className="exit"><i className="zmdi zmdi-close" /></button>

                            <div className="form-title">
                                <p>Mandatory Approval</p>
                                <div className="form-sub-title">
                                    
                                </div>
                            </div>

                            <div className="form-tabulator active">
                                <div className="form-tab-nav-box justify-left">
                                    <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 0
                                    })}>
                                        <i className="zmdi zmdi-close-circle" />
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 1
                                    })}>
                                        <i className="zmdi zmdi-accounts" />
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 2)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 2
                                    })}>
                                        <i className="zmdi zmdi-money-box" />
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 3)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 3
                                    })}>
                                        <i className="zmdi zmdi-chart" />
                                    </a>
                                    <a
                                        onClick={(e) => this.handleTab(e, 4)}
                                        className={classNames({
                                            "form-tab": true,
                                            "active": this.state.activeTab === 4
                                        })}
                                    >
                                        <i className="zmdi zmdi-balance" />
                                    </a>
                                </div>

                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 0
                                })}>
                                    <div className="input-group-app block">
                                        <label style={{marginBottom: 15, display: 'block'}}>Process without approval</label>

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
                                                    <div className="form-group-app no-padding-bottom">
                                                        <div className="input-group-app align-middle display-block offset-bottom">
                                                            <input type="checkbox"/>
                                                            <label>Do not broadcast</label>
                                                        </div>
                                                        <div className="input-group-app align-middle display-block offset-bottom">
                                                            <input type="checkbox"/>
                                                            <label>Add note to self?</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 1
                                })}>
                                    <div className="input-group-app block">
                                        <label style={{marginBottom: 15, display: 'block'}}>Process without approval</label>
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
                                                    <div className="form-group-app no-padding-bottom">
                                                        <div className="input-group-app align-middle display-block offset-bottom">
                                                            <input type="checkbox"/>
                                                            <label>Do not broadcast</label>
                                                        </div>
                                                        <div className="input-group-app align-middle display-block offset-bottom">
                                                            <input type="checkbox"/>
                                                            <label>Add note to self?</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 2
                                })}>
                                    <div className="input-group-app block">
                                        <label style={{marginBottom: 15, display: 'block'}}>Process without approval</label>

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
                                                    <div className="form-group-app no-padding-bottom">
                                                        <div className="input-group-app align-middle display-block offset-bottom">
                                                            <input type="checkbox"/>
                                                            <label>Do not broadcast</label>
                                                        </div>
                                                        <div className="input-group-app align-middle display-block offset-bottom">
                                                            <input type="checkbox"/>
                                                            <label>Add note to self?</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 3
                                })}>
                                    <div className="input-group-app block">
                                        <label style={{marginBottom: 15, display: 'block'}}>Process without approval</label>

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
                                                    <div className="form-group-app no-padding-bottom">
                                                        <div className="input-group-app align-middle display-block offset-bottom">
                                                            <input type="checkbox"/>
                                                            <label>Do not broadcast</label>
                                                        </div>
                                                        <div className="input-group-app align-middle display-block offset-bottom">
                                                            <input type="checkbox"/>
                                                            <label>Add note to self?</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 4
                                })}>
                                    <div className="input-group-app block">
                                        <div className="row">
                                            <label style={{marginBottom: 15, display: 'block'}}>Process without approval</label>

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
                                                    <div className="form-group-app no-padding-bottom">
                                                        <div className="input-group-app align-middle display-block offset-bottom">
                                                            <input type="checkbox"/>
                                                            <label>Do not broadcast</label>
                                                        </div>
                                                        <div className="input-group-app align-middle display-block offset-bottom">
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
                            {/*<AdvancedSettings*/}
                                {/*setValue={setValue}*/}
                                {/*advancedState={this.state.advancedState}*/}
                                {/*white*/}
                            {/*/>*/}
                            <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                <button
                                    type="submit"
                                    name={'closeModal'}
                                    className="btn btn-right blue round round-bottom-right"
                                >
                                    Send
                                </button>
                                <button
                                    type={'button'}
                                    onClick={() => this.props.closeModal()}
                                    className="btn round round-top-left"
                                >
                                    Cancel
                                </button>

                            </div>
                            {/*<div className="btn-box align-buttons-inside absolute left-conner">*/}
                                {/*<a*/}
                                    {/*onClick={this.handleAdvancedState}*/}
                                    {/*className="btn btn-right round round-bottom-left round-top-right absolute"*/}
                                    {/*style={{left : 0, right: 'auto'}}*/}
                                {/*>*/}
                                    {/*{this.state.advancedState ? "Basic" : "Advanced"}*/}
                                {/*</a>*/}
                            {/*</div>*/}
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

export default connect(mapStateToProps, mapDispatchToProps)(MandatoryApproval);
