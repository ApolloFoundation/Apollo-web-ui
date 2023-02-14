import React from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { setBodyModalParamsAction } from 'modules/modals';
import { getIsLocalhostSelector } from 'selectors';
import util from 'helpers/util/utils';

const Settings = ({ isActive, closeMenu }) => {
    const dispatch = useDispatch();
    const isLocalhost = useSelector(getIsLocalhostSelector);

    const handleGenerateTokenModal = () => {
        closeMenu();
        dispatch(setBodyModalParamsAction('TOKEN_GENERATION_VALIDATION'));
    }

    const handleCalculateHashModal = () => {
        closeMenu();
        dispatch(setBodyModalParamsAction('CALCULATE_CACHE'));
    }

    const handleTransactionOperationModal = () => {
        closeMenu();
        dispatch(setBodyModalParamsAction('TRANSACTIONS_OPERATIONS'));
    }

    const handleExportSecretKeysModal = () => {
        closeMenu();
        dispatch(setBodyModalParamsAction('EXPORT_KEY_SEED'));
    }

    const handleShardingInfoModal = () => {
        closeMenu();
        dispatch(setBodyModalParamsAction('SHARDING_INFO'));
    }

    return (
    <div className={classNames(
            "settings-bar settings-menu account-body-modal settings-body-modal-window", {
            "active": isActive,
        })}
    >
        <div className="options-col">
            <ul>
                <li><NavLink activeClass='active' className="option" to="/blocks">Blocks</NavLink></li>
                <li><NavLink activeClass='active' className="option" to="/peers">Peers</NavLink></li>
                <li><NavLink activeClass='active' className="option" to="/generators">Generators</NavLink></li>
                <li><NavLink activeClass='active' className="option" to="/backend-status">Backend Tasks Status</NavLink></li>
                {isLocalhost &&
                    <>
                        <li>
                            <NavLink activeClass='active' className="option" to="/funding-monitors">
                                Monitors
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClass='active' className="option" to="/scheduled-transactions">
                                Scheduled transactions
                            </NavLink>
                        </li>
                    </>
                }
            </ul>
        </div>
        <div className="options-col">
            <ul>
                <li>
                    <a
                        onClick={handleGenerateTokenModal}
                        className="option"
                    >
                        Generate token
                    </a>
                </li>
                <li>
                    <a
                        onClick={handleCalculateHashModal}
                        className="option"
                    >
                        Calculate hash
                    </a>
                </li>
                <li>
                    <a
                        onClick={handleTransactionOperationModal}
                        className="option"
                    >
                        Transaction operations
                    </a>
                </li>
            </ul>

        </div>
        <div className="options-col">
            <ul>
                {util.isDesktopApp() && (
                    <li className='hide-media'>
                        <a
                            href='/test'
                            className="option"
                        >
                            API Console
                        </a>
                    </li>
                )}

                <li>
                    <NavLink
                        activeClass='active'
                        to="/settings"
                        className="option"
                    >
                        Settings
                    </NavLink>
                </li>
                <li>
                    <a
                        onClick={handleExportSecretKeysModal}
                        className="option"
                    >
                        Export Secret File
                    </a>
                </li>
                <li>
                    <a
                        onClick={handleShardingInfoModal}
                        className="option"
                    >
                        Sharding info
                    </a>
                </li>
            </ul>
        </div>
    </div>
)
}

export default Settings;
