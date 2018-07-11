import React from 'react';
import SiteHeader from '../../components/site-header'

class Ledger extends React.Component {
    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Account ledger'}
                    showPrivateTransactions={'ledger'}
                />
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