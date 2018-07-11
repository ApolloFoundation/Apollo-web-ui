import React from 'react';
import SiteHeader from '../../components/site-header'

class Aliases extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Aliases'}
                />
                <div className="page-body container-fluid">
                    <div className="blocks">
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Aliases</td>
                                        <td>URI</td>
                                        <td>Status</td>
                                        <td className="align-right">Actions</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>Alias_name_1</td>
                                        <td className="blue-link-text"><a>http://</a>
                                        </td>
                                        <td>Registered</td>
                                        <td className="align-right">
                                            <div className="btn-box inline"><a className="btn primary blue">Edit</a><a
                                                className="btn primary blue">Transfer</a><a
                                                className="btn primary blue">Sell</a><a
                                                className="btn primary">Delete</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Alias_name_1</td>
                                        <td className="blue-link-text"><a>http://</a>
                                        </td>
                                        <td>Registered</td>
                                        <td className="align-right">
                                            <div className="btn-box inline"><a className="btn primary blue">Edit</a><a
                                                className="btn primary blue">Transfer</a><a
                                                className="btn primary blue">Sell</a><a
                                                className="btn primary">Delete</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Alias_name_1</td>
                                        <td className="blue-link-text"><a>http://</a>
                                        </td>
                                        <td>Registered</td>
                                        <td className="align-right">
                                            <div className="btn-box inline"><a className="btn primary blue">Edit</a><a
                                                className="btn primary blue">Transfer</a><a
                                                className="btn primary blue">Sell</a><a
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