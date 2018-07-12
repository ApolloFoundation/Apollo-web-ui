import { connect } from 'react-redux';
import { Redirect } from  'react-router-dom';

import React from 'react';
import './Login.css'
import account from "../../../modules/account";
import { getAccountDataAction } from '../../../actions/login';

class Login extends React.Component {
    constructor(props) {
        super(props);

        console.log(this.props);

        this.enterAccount = this.enterAccount.bind(this);
    }

    enterAccount() {
        this.props.getAccountAction({
            account: this.refs.accountRS.value
        });



        console.log(this.props);
    }

    render() {
        console.log(this.props.account.account);
        if (this.props.account.account) {
            return <Redirect to='/dashboard'/>
        }

        return (
            <div className="page-content">
                <div className="page-body container-fluid">
                    <div className="login">
                        <div className="form-group offset-bottom">
                            <div className="form-title">
                                <p>Welcome to apollo</p>
                            </div>
                            <div className="input-group">
                                <div className="row">
                                    <div className="col-md-3">
                                        <label>Header</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input ref={'accountRS'} type="text" name={'accountRS'}/>
                                    </div>
                                </div>
                            </div>
                            <button onClick={this.enterAccount} className="btn btn-right">Enter</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state =>  ({
    account: state.account
});

const mapDipatchToProps = dispatch => {
    return {
        getAccountAction: (requestParams) => dispatch(getAccountDataAction(requestParams)),
    };
};

export default connect(
    mapStateToProps,
    mapDipatchToProps
)(Login);