import React from 'react';
import SiteHeader from '../../components/site-header'
import uuid from "uuid";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {connect} from "react-redux";

class FundingMonitors extends React.Component {
    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Funding monitors'}
                >
                    <a className="btn primary"
                       onClick={() => this.props.setBodyModalParamsAction("ADD_MONITOR", {})}>
                        Add monitor
                    </a>
                </SiteHeader>
                <div className="page-body container-fluid">
                    <div className="funding-monitors">
                        <div className="info-box danger">
                            <p>Incorrect &quot;adminPassword&quot; (locked for 1 hour, too many incorrect password
                                attempts)</p>
                        </div>

                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead key={uuid()}>
                                    <tr>
                                        <td>Account</td>
                                        <td>Property</td>
                                        <td>Amount</td>
                                        <td>Threshold</td>
                                        <td>Interval</td>
                                        <td>Action</td>
                                    </tr>
                                    </thead>
                                    <tbody key={uuid()}>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(FundingMonitors);