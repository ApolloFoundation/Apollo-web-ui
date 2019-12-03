import React from 'react';
import {connect} from "react-redux";
import {setTypeAmountOfChart} from "../../../../../modules/modals";
import TVChartContainer from '../trading-view';
import ExchangeSwitch from "./ExchangeSwitch";

class Plot extends React.Component {

    render() {
        const {currentCurrency: {currency}, currencies, switchCurrency, wallet, handleLoginModal, typeAmountOfChart} = this.props;
        return (
            <div className={'card-block primary card card-medium pt-0 h-400'}>
                <div className={'form-group-app overflow-hidden h-100'}>
                    <div className={'form-title form-title-lg d-flex flex-row justify-content-between align-items-center'}>
                        <div className={'d-flex align-items-center mr-2'}>
                            <ExchangeSwitch
                                currency={currency}
                                currencies={currencies}
                                switchCurrency={switchCurrency}
                                wallet={wallet}
                                handleLoginModal={handleLoginModal}
                            />
                        </div>
                        <div className='card-body reverse'>
                            <div className={'tabs-wrap'}>
                                <div
                                    className={`tab-item ${typeAmountOfChart === 'BUY' ? 'active' : ''} plot`}
                                    onClick={() => this.props.setTypeAmountOfChart('BUY')}
                                >
                                    APL/{currency}
                                </div>
                                <div
                                    className={`tab-item ${typeAmountOfChart === 'SELL' ? 'active' : ''} plot`}
                                    onClick={() => this.props.setTypeAmountOfChart('SELL')}
                                >
                                    {currency}/APL
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'card-content'}>
                        <div className={'full-box overflow-hidden chart'}>
                            <TVChartContainer />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    typeAmountOfChart: state.modals.typeAmountOfChart,
});

const mapDispatchToProps = dispatch => ({
    setTypeAmountOfChart: (params) => dispatch(setTypeAmountOfChart(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Plot);