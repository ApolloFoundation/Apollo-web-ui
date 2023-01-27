import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

const SettingsIcon = ({bodyModalType, setBodyModalType}) => (
    <div
        onClick={(e) => setBodyModalType('SETTINGS_BODY_MODAL', e)}
        style={{height: 32}}
        className={classNames({
            "underscore": true,
            "btn": true,
            "stop": true,
            "icon-button": true,
            "filters": true,
            "SETTINGS_BODY_MODAL": true,
            "active": bodyModalType === "SETTINGS_BODY_MODAL",
            "primary": true,
            "user-account-action" : true,
            "transparent": true,
        })}
    >
        <i className="zmdi stop zmdi-settings"/>
    </div>
);

const mapDispatchToProps = dispatch => ({

})

export default connect(null, mapDispatchToProps)(SettingsIcon)