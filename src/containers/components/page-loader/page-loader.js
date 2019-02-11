/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {getAccountDataAction} from '../../../actions/login';

const savedAccount = JSON.parse(localStorage.getItem('APLUserRS'))

const PageLoader = ({loginProblem, getAccountDataAction}) => (
    <div className="page-loader">
        {
            loginProblem ? 
            <div className="connection problem">
                <i class="zmdi zmdi-portable-wifi-off"></i>
                <p>
                    Problem with connectoin
                </p>
                <br/>
                <a
                    className={'btn'}
                    onClick={() => getAccountDataAction(savedAccount)}
                >
                    try to reconnect
                </a>
            </div> :
            <div className="loader ball-scale-multiple">
                <div></div>
                <div></div>
                <div></div>
            </div>
        }
    </div>
)

const mapStateToProps = state => ({
    loginProblem: state.account.loginProblem
})

const mapDispatchToProps = disaptch => ({
    getAccountDataAction: (savedAccount) => disaptch(getAccountDataAction({account: savedAccount}))
})

export default connect(mapStateToProps, mapDispatchToProps)(PageLoader);