import React from 'react';
import SiteHeader from '../../components/site-header'

class AccountProperties extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Account properties'}
                />
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