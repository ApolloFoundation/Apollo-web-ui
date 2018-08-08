import React from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './SiteHeader.css';
import {setPageEvents} from '../../../modules/account';
import classNames from 'classnames';
import {setMopalType, setBodyModalType} from "../../../modules/modals";
import PrivateTransactions from "../../modals/private-transaction";

class SiteHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searching: false
        };

        this.setSearchStateToActive   = this.setSearchStateToActive.bind(this);
        this.resetSearchStateToActive = this.resetSearchStateToActive.bind(this);
        this.searchInterval;
    }

    setSearchStateToActive() {
        clearInterval(this.searchInterval);
        this.setState({
            ...this.state,
            searching: true
        });
    }

    resetSearchStateToActive() {
        this.searchInterval = setTimeout(() => {
            this.setState({
                ...this.state,
                searching: false
            });
        }, 4000);
    }

    setBodyModalType(bodyModalType) {
        if (this.props.bodyModalType) {
            this.props.setBodyModalType(null);

        } else {
            this.props.setBodyModalType(bodyModalType);
        }
    }

    render() {
        return (
            <div className="page-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="page-title-box">
                                <div className="page-title-box">
                                    <h1 className="title">{this.props.pageTitle}</h1>
                                    {
                                        this.props.showPrivateTransactions &&
                                        !this.props.children &&
                                        <a
                                            className="btn primary" onClick={this.props.setMopalType.bind(this, 'PrivateTransactions')}
                                        >
                                            Show private transactions
                                        </a>
                                    }
                                    {
                                        this.props.children &&
                                        this.props.children
                                    }
                                    <div className="breadcrumbs">
                                        <a>Apollo Wallet /</a>
                                        <strong>
                                            <a>{this.props.pageTitle}</a>
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={classNames({
                                "user-search-box" : true,
                                "searching" : this.state.searching
                            })}>
                                {/*TODO : fix site header search animation*/}
                                <div
                                    className={classNames({
                                        'search-bar' : true,
                                    })}
                                >
                                    <input
                                        onMouseOut={this.resetSearchStateToActive}
                                        onMouseDown={this.setSearchStateToActive}
                                        onMouseOver={this.setSearchStateToActive}
                                        className={"searching-window"}
                                        type="text"
                                    />
                                    <div className="user-account-actions">
                                        <a
                                            className="user-account-rs"
                                            onClick={this.props.setMopalType.bind(this, 'SEND_APOLLO')}
                                        >
                                            { this.props.accountRS }
                                        </a>
                                        <a className="user-account-action">
                                            <i className="zmdi zmdi-balance-wallet" />
                                        </a>
                                        <button
                                            className="user-account-action"
                                            onClick={this.setBodyModalType.bind(this, 'SETTINGS_BODY_MODAL')}
                                        >
                                            <i className="zmdi zmdi-settings" />
                                            <div className={classNames({
                                                "settings-bar": true,
                                                "active": this.props.bodyModalType === 'SETTINGS_BODY_MODAL'
                                            })}>
                                                <div className="options-col">
                                                    <ul>
                                                        <li><Link className="option" to="/blocks">Blocks</Link></li>
                                                        <li><Link className="option" to="/peers">Peers</Link></li>
                                                        <li><Link className="option" to="/generators">Generators</Link></li>
                                                        <li><Link className="option" to="/scheduled-transactions">Scheduled transactions</Link></li>
                                                        <li><Link className="option" to="/monitors">monitors</Link></li>
                                                    </ul>
                                                </div>
                                                <div className="options-col">
                                                    <ul>
                                                        <li><a className="option">Generate token</a></li>
                                                        <li><a className="option">Generate hallmark</a></li>
                                                        <li><a className="option">Calculate hash</a></li>
                                                        <li><a className="option">Transaction operations</a></li>
                                                    </ul>

                                                </div>
                                                <div className="options-col">
                                                    <ul>
                                                        <li><a className="option">Refresh search index</a></li>
                                                        <li><a className="option">API console</a></li>
                                                        <li><a className="option">Database shell</a></li>
                                                    </ul>
                                                </div>
                                                <div className="options-col">
                                                    <ul>
                                                        <li><a className="option">Plugins</a></li>
                                                        <li><a className="option">Account settings</a></li>
                                                        <li><a className="option">Device settings</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </button>
                                        <a className="user-account-action">
                                            <i className="zmdi zmdi-help" />
                                        </a>
                                        <a className="user-account-action search-button" onClick={this.setSearchStateToActive}>
                                            <i className="zmdi zmdi-search" />
                                        </a>
                                    </div>
                                </div>
                                <div className="user-box">
                                    <div className="user-name">
                                        <i className="zmdi zmdi-chevron-down" />
                                        <a>{ this.props.name }</a>
                                    </div>
                                    <div className="user-avatar" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    accountRS: state.account.accountRS,
    name: state.account.name,
    moalTtype: state.modals.modalType,
    bodyModalType: state.modals.bodyModalType
});

const mapDispatchToProps = dispatch => ({
    setPageEvents : (prevent) => dispatch(setPageEvents(prevent)),
    setMopalType : (prevent) => dispatch(setMopalType(prevent)),
    setBodyModalType : (prevent) => dispatch(setBodyModalType(prevent))
});


export default connect(mapStateToProps, mapDispatchToProps)(SiteHeader);