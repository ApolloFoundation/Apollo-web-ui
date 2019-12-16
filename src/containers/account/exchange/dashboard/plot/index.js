import React from 'react';
import Chart from 'chart.js';

import {formatDivision} from "../../../../../helpers/format";
import {ONE_GWEI} from '../../../../../constants';

import BtcIcon from '../../../../../assets/BTC.png';
import EthIcon from '../../../../../assets/ETH.png';
import PaxIcon from '../../../../../assets/PAX.png';
import {NotificationManager} from "react-notifications";
import TVChartContainer from '../trading-view';
import ExchangeSwitch from "./ExchangeSwitch";
const currencyIcons = {btc: BtcIcon, eth: EthIcon, pax: PaxIcon};

// const chartJsOption = {
//     type: 'bar',
//     backgroundColor: '#ffffff',
//     hoverBackgroundColor: '#ffffff',
//     options: {
//         legend: false,
//         maintainAspectRatio: false,
//         tooltips: {
//             backgroundColor: '#ffffff',
//             titleFontFamily: 'BBRollerMonoProST, sans-serif',
//             titleFontSize: 10,
//             titleFontStyle: '400',
//             titleFontColor: '#98B0CD',
//             bodyFontFamily: 'BBRollerMonoProST, sans-serif',
//             bodyFontSize: 12,
//             bodyFontColor: '#3D5A7E',
//             borderColor: '#E6EAEE',
//             borderWidth: '1'
//         },
//         scales: {
//             yAxes: [{
//                 position: 'right',
//                 gridLines: {
//                     display: true,
//                     color: 'rgba(207,218,232,0.4)',
//                     zeroLineColor: '#CFDAE8',
//                 },
//                 ticks: {
//                     min: 0,
//                     fontColor: '#CFDAE8',
//                     fontFamily: 'BBRollerMonoProST, sans-serif',
//                     fontSize: '9',
//                     callback: function(value) {
//                         return formatDivision(value, 1, 3);
//                     },
//                 }
//             }],
//             xAxes: [{
//                 gridLines: {
//                     display: false,
//                     color: 'rgba(207,218,232,0.4)',
//                     zeroLineColor: 'rgba(207,218,232,0.4)',
//                 },
//                 ticks: {
//                     min: 0,
//                     fontColor: '#CFDAE8',
//                     fontFamily: 'BBRollerMonoProST, sans-serif',
//                     fontSize: '9',
//                 }
//             }]
//         }
//     }
// };

// const sellOptions = {
//     fill: false,
//     lineTension: 0.1,
//     backgroundColor: '#F36',
//     borderColor: '#F36',
//     borderCapStyle: 'butt',
//     borderDash: [],
//     borderDashOffset: 0.0,
//     borderJoinStyle: 'miter',
//     pointBorderColor: 'rgba(231, 76, 60,1)',
//     pointBackgroundColor: '#fff',
//     pointBorderWidth: 1,
//     pointRadius: 1,
//     pointHitRadius: 10,
// };

// const buyOptions = {
//     fill: false,
//     lineTension: 0.1,
//     backgroundColor: '#2AC940',
//     borderColor: 'rgba(0,189,32,0.92)',
//     borderCapStyle: 'butt',
//     borderDash: [],
//     borderDashOffset: 0.0,
//     borderJoinStyle: 'miter',
//     pointBorderColor: 'rgba(39, 174, 96,1)',
//     pointBackgroundColor: '#fff',
//     pointBorderWidth: 1,
//     pointRadius: 1,
//     pointHitRadius: 10,
// };

export default class Plot extends React.Component {
    // chartOrders = {
    //     chart: null,
    //     ref: React.createRef(),
    // };

    // state = {
    //     loading: true,
    //     buyOrders: null,
    //     sellOrders: null,
    //     buyOrdersData: [],
    //     sellOrdersData: [],
    //     chartBy: 'offerAmount',
    //     filter: 'full',
    // };

    // chartDraw = (datasets) => {
    //     if (this.chartOrders.chart) {
    //         this.chartOrders.chart.data.labels = ['Orders'];
    //         this.chartOrders.chart.data.datasets = datasets;
    //         this.chartOrders.chart.update();
    //     } else {
    //         const context = this.chartOrders.ref.current.getContext('2d');
    //         this.chartOrders.chart = new Chart(context, {
    //             data: {
    //                 labels: ['Orders'],
    //                 datasets
    //             },
    //             ...chartJsOption,
    //         });
    //     }
    // };

    // static getDerivedStateFromProps(props, state) {
    //     if (props.buyOrders && props.sellOrders && (props.buyOrders !== state.buyOrders || props.sellOrders !== state.sellOrders)) {
    //         let buyOrdersData = [];
    //         if (props.buyOrders !== state.buyOrders && props.buyOrders.length > 0) {
    //             buyOrdersData = props.buyOrders.map((el, index) => ({
    //                 ...buyOptions,
    //                 label: `Buy ${formatDivision(el.pairRate, ONE_GWEI, 9)}`,
    //                 data: [parseFloat(el.offerAmount) / ONE_GWEI]
    //             }));
    //         }

    //         let sellOrdersData = [];
    //         if (props.sellOrders !== state.sellOrders && props.sellOrders.length > 0) {
    //             sellOrdersData = props.sellOrders.map((el, index) => ({
    //                 ...sellOptions,
    //                 label: `Sell ${formatDivision(el.pairRate, ONE_GWEI, 9)}`,
    //                 data: [parseFloat(el.offerAmount) / ONE_GWEI]
    //             }));
    //         }
    //         return {
    //             loading: false,
    //             buyOrders: props.buyOrders,
    //             sellOrders: props.sellOrders,
    //             buyOrdersData,
    //             sellOrdersData,
    //         };
    //     }
    //     return null;
    // }

    // componentDidUpdate(prevProps, prevState) {
    //     if (!this.state.loading && this.props.buyOrders && this.props.sellOrders && (
    //         !this.chartOrders.chart || (
    //         (prevProps.buyOrders !== this.props.buyOrders) ||
    //         (prevState.sellOrders !== this.props.sellOrders))
    //     )) {
    //         this.onHandleChangeChart('offerAmount');
    //     }
    // }

    // onHandleChangeFilter = (filter) => {
    //     let data = [];
    //     if (filter === 'buy') data.push(...this.state.buyOrdersData);
    //     if (filter === 'sell') data.push(...this.state.sellOrdersData);
    //     if (filter === 'full') data = [...this.state.buyOrdersData, ...this.state.sellOrdersData];
    //     this.setState({filter});
    //     this.chartDraw(data)
    // };

    // onHandleChangeChart = (filter) => {
    //     const buyOrdersData = this.props.buyOrders.map((el, index) => ({
    //         ...buyOptions,
    //         label: `Buy ${formatDivision(el.pairRate, ONE_GWEI, 9)}`,
    //         data: [parseFloat(el[filter]) / ONE_GWEI]
    //     }));
    //     const sellOrdersData = this.props.sellOrders.map((el, index) => ({
    //         ...sellOptions,
    //         label: `Sell ${formatDivision(el.pairRate, ONE_GWEI, 9)}`,
    //         data: [parseFloat(el[filter]) / ONE_GWEI]
    //     }));
    //     this.setState({
    //         buyOrdersData,
    //         sellOrdersData,
    //         chartBy: filter,
    //     }, () => this.chartDraw([...buyOrdersData, ...sellOrdersData]));

    // };

    render() {
        const {currentCurrency: {currency}, currencies, switchCurrency, wallet, handleLoginModal} = this.props;
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
                    </div>
                    <div className={'card-content'}>
                        <div className={'full-box overflow-hidden chart'}>
                            <TVChartContainer />
                            {/* {!this.state.loading && (
                                <canvas
                                    className={`chart`}
                                    ref={this.chartOrders.ref}
                                />
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
