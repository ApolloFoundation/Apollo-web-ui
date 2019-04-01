import React from 'react';
import {Bar} from 'react-chartjs-2';

import EthIcon from '../../../../assets/ETH.png';
import buyOrdersVal from '../buyOrders';
import sellOrdersVal from '../sellOrders';

const buyOrders = buyOrdersVal.map((el, index) => ({
    label: `Buy ${el.price}`,
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
    data: [{x: 10 * index, y: parseFloat(el.amount), r: 5}]
}));

const sellOrders = sellOrdersVal.map((el, index) => ({
    label: `Sell ${el.price}`,
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
    data: [{x: 10 * index, y: parseFloat(el.amount), r: 5}]
}));

export default class Plot extends React.Component {
    state = {
        data : {
            labels: ['Orders'],
            datasets: [...buyOrders, ...sellOrders]
        }
    };

    onHandleFilterBuy = () => {
        this.setState({
            data : {
                labels: ['Orders Buy'],
                datasets: [...buyOrders]
            }
        })
    };

    onHandleFilterSell = () => {
        this.setState({
            data : {
                labels: ['Orders Sell'],
                datasets: [...sellOrders]
            }
        })
    };

    onHandleFilterFull = () => {
        this.setState({
            data : {
                labels: ['Orders'],
                datasets: [...buyOrders, ...sellOrders]
            }
        })
    };

    render() {
        const {currency} = this.props.currentCurrency;
        return (
            <div className={'card-block primary card card-medium pt-0 h-100'}>
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
                                    onClick={this.onHandleFilterBuy}
                                    className={'btn btn-sm bg-danger ml-3 mt-2'}
                                >
                                    Buy
                                </button>
                                <button
                                    onClick={this.onHandleFilterSell}
                                    className={'btn btn-sm bg-success ml-3 mt-2'}
                                >
                                    Sell
                                </button>
                                <button
                                    onClick={this.onHandleFilterFull}
                                    className={'btn btn-sm blue ml-3 mt-2'}
                                >
                                    Price
                                </button>
                                <button
                                    onClick={this.onHandleFilterFull}
                                    className={'btn btn-sm blue ml-3 mr-3 mt-2'}
                                >
                                    Amount
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
                                onClick={this.onHandleFilterBuy}
                                className={'btn btn-sm bg-danger ml-3 mt-2'}
                            >
                                Buy
                            </button>
                            <button
                                onClick={this.onHandleFilterSell}
                                className={'btn btn-sm bg-success ml-3 mt-2'}
                            >
                                Sell
                            </button>
                            <button
                                onClick={this.onHandleFilterSell}
                                className={'btn btn-sm blue ml-3 mt-2'}
                            >
                                Price
                            </button>
                            <button
                                onClick={this.onHandleFilterSell}
                                className={'btn btn-sm blue ml-3 mr-3 mt-2'}
                            >
                                Value
                            </button>
                        </div>
                        <div className={'full-box overflow-hidden'}>
                            <Bar
                                data={this.state.data}
                                width={100}
                                height={'300px'}
                                options={{
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
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};