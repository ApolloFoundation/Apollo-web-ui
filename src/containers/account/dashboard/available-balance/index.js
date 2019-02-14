import React, {Component} from 'react';
import {connect} from 'react-redux';
import ContentLoader from '../../../components/content-loader'

class AvailableBalance extends Component {
    render () {
        return (
            <div
                className={`card header justify-content-start ballance chart-sprite position-1 mb-3 ${this.state.positionState1 ? "show-hide-content" : ""}`}>
                <div className="card-title">Available Balance</div>
                <div className="arrow-block" onClick={this.position1}>
                    <div className="arrow"/>
                </div>
                {
                    this.state.accountInfo && this.state.block &&
                    <React.Fragment>
                        <div className="page-body-item-content">

                            <div
                                onClick={() => this.props.setBodyModalParamsAction('ACCOUNT_DETAILS')}
                                style={{cursor: 'pointer', paddingRight: 0}}
                                className="amount"
                            >
                                {
                                    this.state.accountInfo &&
                                    this.state.accountInfo.unconfirmedBalanceATM &&
                                    Math.round(this.state.accountInfo.unconfirmedBalanceATM / 100000000).toLocaleString('en')
                                    || 0
                                }
                                <span className="currency">
                            &nbsp;APL
                        </span>
                            </div>
                            <div className="account-sub-titles">
                                {this.state.accountInfo && this.state.accountInfo.accountRS}
                            </div>

                            {
                                this.state.block &&
                                <div className="account-sub-titles">
                                    Block:&nbsp;{this.state.block.height}&nbsp;/&nbsp;{this.props.formatTimestamp(this.state.block.timestamp)}
                                </div>
                            }
                            {
                                this.props.blockTime &&
                                <div className="account-sub-titles">
                                    Transaction Time :&nbsp;{this.props.blockTime} s
                                </div>
                            }
                        </div>
                    </React.Fragment>  ||
                    <ContentLoader white noPaddingOnTheSides/>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(AvailableBalance)