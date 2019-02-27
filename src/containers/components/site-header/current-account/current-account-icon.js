import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

const CurrentAccountIcon = ({name}) => (
    <>
        <div className="user-name">
            <a
                style={{
                    height: 25,
                    width: 25,
                    margin: "0 15px 0 0"
                }}
                className={classNames({
                    "underscore": true,
                    "account": true,
                    "btn": true,
                    "stop": true,
                    "icon-button": true,
                    "filters": true,
                    "ACCOUNT_BODY_MODAL": true,
                    "primary": true,
                    // "active": this.state.bodyModalType=== "ACCOUNT_BODY_MODAL",
                    "active": false,
                    "transparent": true,
                    "open-settings": true,
                    "icon-button ": true,
                    "user-account-action": true
                })}
            >
                <i className="to-revert stop zmdi zmdi-chevron-down"/>
            </a>
            <a className={"name stop"}>{name}</a>
        </div>
        <div className="user-avatar stop">
            <i className="zmdi stop zmdi-account"></i>
        </div>
    </>
)

const mapStateToProps = state => ({
    name: state.account.name,
})

export default connect(mapStateToProps)(CurrentAccountIcon);