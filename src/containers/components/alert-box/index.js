import React from 'react';
import {connect} from 'react-redux';
import classNames from "classnames";

import './AlertBox.css';

const AlertBox = (props) => (
    <div className="alert-box">
        {
            props.alertStatus &&
            <div
                className={classNames({
                    'info-box': true,
                    'success': props.alertStatus === 'success'
                })}>
                <p>
                    {props.alertMessage}
                </p>
            </div>
        }
    </div>
);

const mapStateToProps = state => ({
    alertStatus: state.modals.alertStatus,
    alertMessage: state.modals.alertMessage
});

export default connect(mapStateToProps)(AlertBox);