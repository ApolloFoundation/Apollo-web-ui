import React from "react";
import { connect } from 'react-redux';
import './SiteHeader.css';
import classNames from 'classnames';

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

        console.log(this.state.searching);
    }

    resetSearchStateToActive() {
        this.searchInterval = setTimeout(() => {
            this.setState({
                ...this.state,
                searching: false
            });
        }, 2000);
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
                                        <a className="btn primary">Show private transactions</a>

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
                            <div className="user-search-box">
                                {/*TODO : fix site header search animation*/}
                                <div onMouseOut={this.resetSearchStateToActive} className={classNames({
                                    'search-bar' : true,
                                    'searching' : this.state.searching
                                })}>
                                    <input type="text" onMouseOver={this.setSearchStateToActive}/>
                                    <div className="user-account-actions">
                                        <a className="user-account-rs">
                                            { this.props.accountRS }
                                        </a>
                                        <a className="user-account-action"><i className="zmdi zmdi-balance-wallet"></i></a>
                                        <a className="user-account-action"><i className="zmdi zmdi-settings"></i></a>
                                        <a className="user-account-action"><i className="zmdi zmdi-help"></i></a>
                                        <a className="user-account-action" onClick={this.setSearchStateToActive}><i className="zmdi zmdi-search"></i></a>
                                    </div>
                                </div>
                                <div className="user-box">
                                    <div className="user-name">
                                        <i className="zmdi zmdi-chevron-down"></i>
                                        <a>{ this.props.name }</a>
                                    </div>
                                    <div className="user-avatar"></div>
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
});

export default connect(mapStateToProps)(SiteHeader);