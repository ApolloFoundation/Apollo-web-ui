import React from 'react';
import SiteHeader from '../../components/site-header'

class FundingMonitors extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Asset exchange'}
                />
                <div className="page-body container-fluid">
                    <div className="funding-monitors">
                        <div className="info-box info">
                            <p>Information in this table is delayed by up to 30 seconds, use the desktop wallet for more
                                up to date information.</p>
                        </div>
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Account</td>
                                        <td>Property</td>
                                        <td className="align-right">Amount</td>
                                        <td>Threshold</td>
                                        <td>Interval</td>
                                        <td>Action</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="blue-link-text"><a>APL-8MVA-XCVR-3JC9-2C7C3</a>
                                        </td>
                                        <td>?</td>
                                        <td className="align-right">150,193,581</td>
                                        <td>?</td>
                                        <td>?</td>
                                        <td>?</td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>APL-8MVA-XCVR-3JC9-2C7C3</a>
                                        </td>
                                        <td>?</td>
                                        <td className="align-right">150,193,581</td>
                                        <td>?</td>
                                        <td>?</td>
                                        <td>?</td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>APL-8MVA-XCVR-3JC9-2C7C3</a>
                                        </td>
                                        <td>?</td>
                                        <td className="align-right">150,193,581</td>
                                        <td>?</td>
                                        <td>?</td>
                                        <td>?</td>
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

export default FundingMonitors;