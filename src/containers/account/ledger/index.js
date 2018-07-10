import React from 'react';

class Ledger extends React.Component {
    render() {
        return (
            <div className="page-content">
                <div className="page-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="page-title-box">
                                    <div className="page-title-box">
                                        <h1 className="title">Account ledger</h1><a className="btn primary">Show private
                                        transactions</a>
                                        <div className="breadcrumbs"><a>Apollo Wallet /</a><strong><a>Account
                                            ledger</a></strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="user-search-box">
                                    <div className="search-bar">
                                        <input type="text"/>
                                    </div>
                                    <div className="user-box">
                                        <div className="user-name"><a>Viktoria Apollo</a>
                                        </div>
                                        <div className="user-avatar"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-body container-fluid">
                    <div className="account-ledger">
                        <div className="info-box info">
                            <p>Only ledger entries created during the last 30000 blocks are displayed.</p>
                        </div>
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Entry</td>
                                        <td>Type</td>
                                        <td className="align-right">Change</td>
                                        <td>Balance</td>
                                        <td>Holding</td>
                                        <td className="align-right">Change</td>
                                        <td className="align-right">Balance</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td>Transaction Fee<a><span className="info"></span></a>
                                        </td>
                                        <td className="align-right">-1.0</td>
                                        <td>7,460.0</td>
                                        <td>
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                        <td className="align-right">
                                            <a></a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div className="btn-box"><a className="btn btn-left"> Previous</a><a
                                    className="btn btn-right">Next</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Ledger;