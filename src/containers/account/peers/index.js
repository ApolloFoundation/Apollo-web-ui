import React from 'react';
import SiteHeader from '../../components/site-header'

class Peers extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Asset exchange'}
                />
                <div className="page-body container-fluid">
                    <div className="peers">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="card header ballance single">
                                    <div className="card-title">Uploaded Volume</div>
                                    <div className="amount">30 MB</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card header assets single">
                                    <div className="card-title">Downloaded Volume</div>
                                    <div className="amount">42 MB</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card header currencies single">
                                    <div className="card-title">Connected Peers</div>
                                    <div className="amount">9</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card header coins single">
                                    <div className="card-title">Up-to-date Peers</div>
                                    <div className="amount">9/9</div>
                                </div>
                            </div>
                        </div>
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Address</td>
                                        <td className="align-right">Weight</td>
                                        <td className="align-right">Downloaded</td>
                                        <td className="align-right">Uploaded</td>
                                        <td className="align-right">Application</td>
                                        <td>Platform</td>
                                        <td className="align-right">Services</td>
                                        <td className="align-right">Actions</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>18.216.96.216</a>
                                        </td>
                                        <td className="align-right">-6</td>
                                        <td className="align-right">5 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="align-right">4 MB</td>
                                        <td className="blue-link-text">prod-node-1</td>
                                        <td className="align-right">AI, CS</td>
                                        <td className="align-right"><a className="btn primary blue">Content</a><a
                                            className="btn primary">Blacklist</a>
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

export default Peers;