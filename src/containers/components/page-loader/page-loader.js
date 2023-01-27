/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import { getLoginProblemSelector } from 'selectors';
import {getAccountDataAction} from 'actions/login';

const savedAccount = JSON.parse(localStorage.getItem('APLUserRS'))

const PageLoader = ({loginProblem, getAccountDataAction}) => (
    <div className="page-loader">
        {
            loginProblem ? 
            <div className="connection problem">
                <i class="zmdi zmdi-portable-wifi-off"></i>
                <p>
                    Problem with connection
                </p>
                <br/>
                <button
                    type={'button'}
                    className={'btn'}
                    onClick={() => getAccountDataAction(savedAccount)}
                >
                    try to reconnect
                </button>
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
    loginProblem: getLoginProblemSelector(state),
})

const mapDispatchToProps = {
    getAccountDataAction
}

export default connect(mapStateToProps, mapDispatchToProps)(PageLoader);