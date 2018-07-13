import React from "react";
import { connect } from 'react-redux';
import {
    Route,
    Redirect,
} from "react-router-dom";


const PrivateRoute = (props, { component: Component, ...rest }) => {

    console.log(props);
    return (
        <Route
            {...rest}
            render={props =>
                props.account ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
}

const mapStateToProps = state => ({
    account: state.account.account
});

export default connect(mapStateToProps)(PrivateRoute);