import React from 'react';
import SiteHeader from '../../components/site-header'

class AccountProperties extends React.Component {
    render () {
        return (
            <div className="page-content">
                <div className="page-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="page-title-box">
                                    <div className="page-title-box">
                                        <h1 className="title">Account properties</h1>
                                        <div className="btn-box inline"><a className="btn primary">Incoming</a><a
                                            className="btn primary">Outgoing</a><a className="btn primary">Set</a>
                                        </div>
                                        <div className="breadcrumbs"><a>Apollo Wallet /</a><strong><a>Account
                                            properties</a></strong>
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
                                        <div className="user-avatar"
                                             style={{
                                                 backgroundImage: 'url(../img/man.svg)'
                                             }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-body container-fluid">
                    <div className="funding-monitors">
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Setter</td>
                                        <td>Property</td>
                                        <td>Value</td>
                                        <td className="align-right">Actions</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="blue-link-text"><a>You</a>
                                        </td>
                                        <td>example</td>
                                        <td>test</td>
                                        <td className="align-right">
                                            <div className="btn-box inline"><a className="btn primary blue">Update</a><a
                                                className="btn primary">Delete</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>You</a>
                                        </td>
                                        <td>example</td>
                                        <td>test</td>
                                        <td className="align-right">
                                            <div className="btn-box inline"><a className="btn primary blue">Update</a><a
                                                className="btn primary">Delete</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>You</a>
                                        </td>
                                        <td>example</td>
                                        <td>test</td>
                                        <td className="align-right">
                                            <div className="btn-box inline"><a className="btn primary blue">Update</a><a
                                                className="btn primary">Delete</a>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                {/*// <!--.btn-box-->*/}
                                {/*// <!--	a.btn.btn-left  Previous-->*/}
                                {/*// <!--	a.btn.btn-right Next-->*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountProperties;