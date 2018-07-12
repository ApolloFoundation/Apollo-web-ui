import React from 'react';
import './Login.css'

class Login extends React.Component {
    constructor(props) {
        super(props);


    }

    render() {
        return (
            <div className="page-content">
                <div className="page-body container-fluid">
                    <div className="login">
                        <div className="form-group compensate-margin">
                            <div className="form-title">
                                <p>Welcome to apollo</p>
                            </div>
                            <div className="input-group">
                                <div className="row">
                                    <div className="col-md-3">
                                        <label>Header</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input type="select"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;