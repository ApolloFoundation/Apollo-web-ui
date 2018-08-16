import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import classNames from 'classnames';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import {Form, Text, TextArea} from 'react-form'

class TokenGenerationValidation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
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

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm
                             }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group">
                                <div className="form-title">
                                    <p>Token generation / validation</p>
                                </div>

                                <div className="form-tabulator active">
                                    <div className="form-tab-nav-box justify-left">
                                        <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                            "form-tab": true,
                                            "active": this.state.activeTab === 0
                                        })}>
                                            <p>Generate token</p>
                                        </a>
                                        <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                            "form-tab": true,
                                            "active": this.state.activeTab === 1
                                        })}>
                                            <p>Validate token</p>
                                        </a>
                                    </div>

                                    <div className={classNames({
                                        "tab-body": true,
                                        "active": this.state.activeTab === 0
                                    })}>
                                        <div className="input-group block offset-bottom offset-top">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Data</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <TextArea rows={5} type="text" field={'data'} placeholder="Website or text"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group block">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Passphrase</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <Text type="text" field={'passphrase'} placeholder="passphrase"/>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className={classNames({
                                        "tab-body": true,
                                        "active": this.state.activeTab === 1
                                    })}>
                                        <div className="input-group block offset-bottom offset-top">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Data</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <TextArea rows={5} type="text" field={'data'} placeholder="Website or text"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group block">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Passphrase</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <Text type="text" field={'passphrase'} placeholder="passphrase"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <AdvancedSettings advancedState={this.state.advancedState} white/>
                            </div>

                            <div className="btn-box align-buttons-inside absolute right-conner">
                                <button className="btn btn-right round round-top-left">Cancel</button>
                                <button
                                    type="submit"
                                    name={'closeModal'}
                                    className="btn btn-right blue round round-bottom-right"
                                >
                                    Validate
                                </button>

                            </div>

                        </form>
                    )}
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
    setModalData: (data) => dispatch(setModalData(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(TokenGenerationValidation);
