import React from 'react';
import Chart from 'chart.js';

import EthIcon from '../../../../assets/ETH.png';

const chartJsOption = {
    type: 'bar',
    options: {
        legend: false,
        maintainAspectRatio: false,
        tooltips: {
            backgroundColor: '#ffffff',
            titleFontFamily: 'BBRollerMonoProST, sans-serif',
            titleFontSize: 10,
            titleFontStyle: '400',
            titleFontColor: '#98B0CD',
            bodyFontFamily: 'BBRollerMonoProST, sans-serif',
            bodyFontSize: 12,
            bodyFontColor: '#3D5A7E',
            borderColor: '#E6EAEE',
            borderWidth: '1'
        },
        scales: {
            yAxes: [{
                gridLines: {
                    display: false,
                    color: '#CFDAE8',
                },
                ticks: {
                    fontColor: '#8AA5C7',
                    fontFamily: 'BBRollerMonoProST, sans-serif',
                    fontSize: '11',
                }
            }],
            xAxes: [{
                gridLines: {
                    display: false,
                    color: '#CFDAE8',
                },
                ticks: {
                    fontColor: '#8AA5C7',
                    fontFamily: 'BBRollerMonoProST, sans-serif',
                    fontSize: '11',
                }
            }]
        }
    }
};

const buyOptions = {
    fill: false,
    lineTension: 0.1,
    backgroundColor: '#F36',
    borderColor: '#F36',
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: 'rgba(231, 76, 60,1)',
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: 'rgba(231, 76, 60,1)',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointRadius: 1,
    pointHitRadius: 10,
};

const sellOptions = {
    fill: false,
    lineTension: 0.1,
    backgroundColor: 'rgba(0,189,32,0.92)',
    borderColor: 'rgba(0,189,32,0.92)',
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: 'rgba(39, 174, 96,1)',
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: 'rgba(39, 174, 96,1)',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointRadius: 1,
    pointHitRadius: 10,
};

export default class Plot extends React.Component {
    chartOrders = {
        chart: null,
        ref: React.createRef(),
    };

    state = {
        loading: true,
        buyOrdersData: [],
        sellOrdersData: [],
        chartBy: 'amount',
        filter: 'full',
    };

    chartDraw = (datasets) => {
        if (this.chartOrders.chart) {
            this.chartOrders.chart.data.labels = ['Orders'];
            this.chartOrders.chart.data.datasets = datasets;
            this.chartOrders.chart.update();
        } else {
            const context = this.chartOrders.ref.current.getContext('2d');
            this.chartOrders.chart = new Chart(context, {
                data: {
                    labels: ['Orders'],
                    datasets
                },
                ...chartJsOption,
            });
        }
    };

    static getDerivedStateFromProps(props, state) {
        if (props.buyOrders !== state.buyOrders && props.sellOrders !== state.sellOrders) {
            const buyOrdersData = props.buyOrders.map((el, index) => ({
                ...buyOptions,
                label: `Buy ${el.price}`,
                data: [parseFloat(el.amount)]
            }));
            const sellOrdersData = props.sellOrders.map((el, index) => ({
                ...sellOptions,
                label: `Buy ${el.price}`,
                data: [parseFloat(el.amount)]
            }));
            return {
                loading: false,
                buyOrdersData,
                sellOrdersData,
            };
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.chartOrders.chart && prevState.buyOrdersData && prevState.sellOrdersData) {
            this.onHandleChangeChart('amount');
        }
    }

    onHandleChangeFilter = (filter) => {
        let data = [];
        if (filter === 'buy') data.push(...this.state.buyOrdersData);
        if (filter === 'sell') data.push(...this.state.sellOrdersData);
        if (filter === 'full') data = [...this.state.buyOrdersData, ...this.state.sellOrdersData];
        this.setState({filter});
        this.chartDraw(data)
    };

    onHandleChangeChart = (filter) => {
        const buyOrdersData = this.props.buyOrders.map((el, index) => ({
            ...buyOptions,
            label: `Buy ${el.price}`,
            data: [parseFloat(el[filter])]
        }));
        const sellOrdersData = this.props.sellOrders.map((el, index) => ({
            ...sellOptions,
            label: `Buy ${el.price}`,
            data: [parseFloat(el[filter])]
        }));
        this.setState({
            buyOrdersData,
            sellOrdersData,
            chartBy: filter,
        }, () => this.chartDraw([...buyOrdersData, ...sellOrdersData]));

    };

    render() {
        const {currency} = this.props.currentCurrency;
        return (
            <div className={'card-block primary card card-medium pt-0 h-400'}>
                <div className={'form-group-app overflow-hidden'}>
                    <div className={'form-title form-title-lg d-flex flex-row justify-content-between align-items-center'}>
                        <div className={'d-flex align-items-center'}>
                            <img src={EthIcon} alt="ETH"/>
                            <p className={'title-lg'}>
                                APL/{currency.toUpperCase()}
                            </p>
                        </div>
                        <div className={'form-title-actions'}>
                            <div className={'options-section'}>
                                <button
                                    onClick={() => this.onHandleChangeFilter('buy')}
                                    className={`btn btn-sm bg-danger ml-3 mt-2 ${this.state.filter === 'buy' ? 'bold-text' : ''}`}
                                >
                                    Buy
                                </button>
                                <button
                                    onClick={() => this.onHandleChangeFilter('sell')}
                                    className={`btn btn-sm bg-success ml-3 mt-2 ${this.state.filter === 'sell' ? 'bold-text' : ''}`}
                                >
                                    Sell
                                </button>
                                <button
                                    onClick={() => this.onHandleChangeChart('amount')}
                                    className={`btn btn-sm blue ml-3 mt-2 ${this.state.chartBy === 'amount' ? 'bold-text' : ''}`}
                                >
                                    Amount
                                </button>
                                <button
                                    onClick={() => this.onHandleChangeChart('value')}
                                    className={`btn btn-sm blue ml-3 mr-3 mt-2 ${this.state.chartBy === 'value' ? 'bold-text' : ''}`}
                                >
                                    Value
                                </button>
                            </div>
                            <div className={'info-section'}>
                                <div>
                                    0.00001540 <span className={'green'}>+11.19%</span>
                                </div>
                                <div className={'sub-info-section'}>
                                    ≈0.0022$ (0.12%)
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'card-content'}>
                        <div className={'chart-options'}>
                            <div className={'time-section'}>
                                <button className={'btn btn-sm active'}>1h</button>
                                <button className={'btn btn-sm ml-3'}>1d</button>
                                <button className={'btn btn-sm ml-3'}>1w</button>
                            </div>
                            <div className={'info-section'}>
                                <div>High: <span>0.0000017</span></div>
                                <div>Low: <span>0.0000017</span></div>
                            </div>
                        </div>
                        <div className={'options-section'}>
                            <button
                                onClick={() => this.onHandleChangeFilter('buy')}
                                className={'btn btn-sm bg-danger ml-3 mt-2'}
                            >
                                Buy
                            </button>
                            <button
                                onClick={() => this.onHandleChangeFilter('sell')}
                                className={'btn btn-sm bg-success ml-3 mt-2'}
                            >
                                Sell
                            </button>
                            <button
                                onClick={() => this.onHandleChangeChart('amount')}
                                className={'btn btn-sm blue ml-3 mt-2'}
                            >
                                Amount
                            </button>
                            <button
                                onClick={() => this.onHandleChangeChart('value')}
                                className={'btn btn-sm blue ml-3 mr-3 mt-2'}
                            >
                                Value
                            </button>
                        </div>
                        <div className={'full-box overflow-hidden'}>
                            {!this.state.loading && (
                                <canvas
                                    className={`chart`}
                                    ref={this.chartOrders.ref}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};