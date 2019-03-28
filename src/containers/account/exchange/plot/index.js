import React from 'react';
import {Bar} from 'react-chartjs-2';

import EthIcon from '../../../../assets/ETH.png';

const buyOrders = [
    {
        x: "Buy Order Group 0",
        y: 95,
    }, {
        x: "Buy Order Group 1",
        y: 85
    }, {
        x: "Buy Order Group 2",
        y: 75
    }, {
        x: "Buy Order Group 3",
        y: 65
    }, {
        x: "Buy Order Group 4",
        y: 55
    }, {
        x: "Buy Order Group 5",
        y: 45
    },
].map((el, index) => ({
    label: el.x,
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
    data: [{x: 10 * index, y:el.y, r: 5}]
}));

const sellOrders = [
    {
        x: "Sell Order Group 0",
        y: 55
    }, {
        x: "Sell Order Group 1",
        y: 65
    }, {
        x: "Sell Order Group 2",
        y: 75
    }, {
        x: "Sell Order Group 3",
        y: 85
    }, {
        x: "Sell Order Group 4",
        y: 95
    }, {
        x: "Sell Order Group 5",
        y: 105
    }
].map((el, index) => ({
    label: el.x,
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
    data: [{x: 10 * index, y:el.y, r: 5}]
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
                labels: ['Orders'],
                datasets: [...buyOrders]
            }
        })
    };

    onHandleFilterSell = () => {
        this.setState({
            data : {
                labels: ['Orders'],
                datasets: [...sellOrders]
            }
        })
    };

    render() {
        return (
            <div className={'card-block primary card card-medium pt-0 h-100'}>
                <div className={'form-group-app overflow-hidden'}>
                    <div className={'form-title form-title-lg d-flex flex-row justify-content-between align-items-center'}>
                        <div className={'d-flex align-items-center'}>
                            <img src={EthIcon} alt="ETH"/>
                            <p className={'title-lg'}>
                                APL/ETH
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
                            <div className={'info-section'}>
                                <div>
                                    0.00001767 <span className={'green'}>+11.70%</span>
                                </div>
                                <div className={'sub-info-section'}>
                                    ≈0.0019$ (0.12%)
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