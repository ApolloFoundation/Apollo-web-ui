import React from 'react';
import SiteHeader from '../../../containers/components/site-header'

class Settings extends React.Component {
    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Scheduled transactions'}
                />
                <div className="page-body container-fluid">
                    <div className="account-settings">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group compensate-margin">
                                    <div className="form-title">
                                        <p>General</p>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Language</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Regional format</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Use 24 hour format</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Maximum decimal positions</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Enable plugins</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label></label>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-sub-title">Need restart of client.</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Show console log button</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Administrator password</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group compensate-margin">
                                    <div className="form-title">
                                        <p>User interface behaviour</p>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Submit forms on enter</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label></label>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-sub-title">Be careful when choosing to submit forms
                                                    via the enter key, submitting can't be undone.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Enable marketplace section</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Enable exchange section</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Animate forging indicator</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Items to show per page</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group compensate-margin">
                                    <div className="form-title">
                                        <p>Form warnings</p>
                                        <div className="form-sub-title">Show a warning when an amount / fee entered is
                                            higher than specified below.
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Max amount warning</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Max fee warning</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Max asset transfer warning</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Maximum decimal positions</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Max currency transfer warning</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Show fake warnings</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group compensate-margin">
                                    <div className="form-title">
                                        <p>Theme settings</p>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Header</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Sidebar</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Boxes</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group compensate-margin">
                                    <div className="form-title">
                                        <p>Exchange settings</p>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>ShapeShift URL</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>ShapeShift API Key</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Changelly URL</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Changelly URL</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Changelly API Secret</label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="select"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="btn-box absolute right-conner more-padding">
                                    <a onClick={() => this.props.closeModal()} className="btn primary">Cancel</a>
                                    <div className="btn primary blue">Save settings</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Settings;