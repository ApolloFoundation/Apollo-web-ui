import React from 'react';
import SiteHeader from '../../components/site-header'

class Transactions extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Transactions'}
                    showPrivateTransactions={'transactions'}
                />
                <div className="page-body container-fluid">
                    <div className="my-transactions">
                        <div className="transactions-filters">
                            <div className="top-bar">
                                <div className="btn filter">All</div>
                            </div>
                            <div className="bottom-bar">
                                <div className="btn filter">All types</div>
                            </div>
                        </div>
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Date</td>
                                        <td>Type</td>
                                        <td className="align-right">Amount</td>
                                        <td className="align-right">Fee</td>
                                        <td>Account</td>
                                        <td className="align-right">Phasing</td>
                                        <td className="align-right">Height</td>
                                        <td className="align-right">Confirmations</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="blue-link-text"><a>6/13/2018 11:34:03</a>
                                        </td>
                                        <td></td>
                                        <td className="align-right">10 455</td>
                                        <td className="align-right">1</td>
                                        <td className="blue-link-text"><a>APL-B3WF-N86S-QQ96-95PJP -> You</a>
                                        </td>
                                        <td className="align-right"></td>
                                        <td className="align-right blue-link-text"><a>152526</a>
                                        </td>
                                        <td className="align-right"><a>213</a>
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

export default Transactions;