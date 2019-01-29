import React from 'react';
import classNames from 'classnames';

export const TabContainer = (props) => {
    const {children, active} = props;

    return (
        <React.Fragment>
            {
                active &&
                <div
                    className={classNames({
                        "tab-body": true,
                        "active": active
                    })}
                >
                    <div className="form-tab">
                        {children}
                    </div>
                </div>
            }
        </React.Fragment>
        
    )
}