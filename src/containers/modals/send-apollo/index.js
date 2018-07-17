import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';

import classNames from 'classnames';

class SendApollo extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.state = {
            activeTab: 0,
            advancedState: false
        }

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }

    handleFormSubmit(e) {
        e.preventDefault();
    }

    handleTabChange(tab) {
        this.setState({
            ...this.props,
            activeTab: tab
        })
    }

    handleAdvancedState() {
        console.log(this.state.advancedState);
        if (this.state.advancedState) {
            console.log(22)
            this.setState({
                ...this.props,
                advancedState: false
            })
        } else {
            console.log(22)

            this.setState({
                ...this.props,
                advancedState: true
            })
        }
    }

    render() {
        return (
            <div className="modal-box">
                <form className="modal-form" onSubmit={this.handleFormSubmit.bind(this)}>
                    <div className="form-group">
                        <div className="form-title">
                            <p>Send Apollo</p>
                        </div>
                        <div className="input-group">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Recipient</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                </div>
                            </div>
                        </div>
                        <div className="input-group">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Recipient</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                </div>
                            </div>
                        </div>
                        <div className="input-group">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Fee</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                </div>
                            </div>
                        </div>
                        <div className="input-group">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Passphrase</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
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
                                                    <div className="input-group align-middle">
                                                        <input type="checkbox"/>
                                                        <label>Do not broadcast</label>
                                                    </div>
                                                    <div className="input-group align-middle">
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
                        <div className="btn-box align-buttons-inside absolute right-conner">
                            <button className="btn btn-right round round-top-left">Cancel</button>
                            <button name={'closeModal'} className="btn btn-right blue round round-bottom-right">Send</button>

                        </div>
                        <div className="btn-box align-buttons-inside absolute left-conner">
                            <button
                                onClick={this.handleAdvancedState}
                                type="submit"
                                className="btn btn-right round round-bottom-left round-top-right"
                            >
                                Advanced
                            </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(SendApollo);
