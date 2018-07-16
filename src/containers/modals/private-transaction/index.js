import React from 'react';

class PrivateTransactions extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="modal-box">
                <div className="modal-form">
                    <div className="form-group">
                        <div className="form-title">
                            <p>Show private transactions</p>
                        </div>
                        <div className="input-group">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Passphrase</label>
                                </div>
                                <div className="col-md-9">
                                    <input ref={'accountRS'} type="text" name={'accountRS'}/>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-right">Enter</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default PrivateTransactions;
