import React from 'react';
import {connect} from 'react-redux';
import { getAccountNameSelector, getAccountPublicKeySelector } from '../../../../selectors';

const CurrentAccountIcon = ({ name, publicKey }) => (
    <>
        <div className="user-avatar stop">
            <i className="zmdi stop zmdi-account"/>
        </div>
        <div className="user-box-info">
            <div>
                {name && (
                    <p className={'user-name'}>
                        {name}
                    </p>
                )}
                <p className={`user-status text-ellipsis ${publicKey ? 'verified' : ''}`}>
                    {publicKey ? 'Verified' : 'Not Verified'}
                </p>
            </div>
            <i className="user-box-icon to-revert zmdi zmdi-chevron-down"/>
        </div>
    </>
);

const mapStateToProps = state => ({
    name: getAccountNameSelector(state),
    publicKey: getAccountPublicKeySelector(state),
});

export default connect(mapStateToProps)(CurrentAccountIcon);