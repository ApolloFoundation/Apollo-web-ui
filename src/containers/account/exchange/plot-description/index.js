import React from 'react';
import ModalBody from '../../../components/modals/modal-body';
import CustomTable from '../../../components/tables/table';

const buyOrders = [
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
]

class PlotDescription extends React.PureComponent {
    render () {
        return (
            <div className={'container-fluid h-100 p-0'}>
                <div className={'col-md-6 pl-3 pr-0 h-100 d-inline-flex'}>
                    <div className={'form-group-app p-0'}>
                        <CustomTable
                            tableName={'Buy'}
                            header={[
                                {
                                    name: 'PRICE (ETH)',
                                    alignRight: false
                                },{
                                    name: 'AMOUNT (ETH)',
                                    alignRight: false
                                },{
                                    name: 'TOTAL (ETH)',
                                    alignRight: true
                                }
                            ]}
                            className={'mb-3 pt-0 no-min-height no-padding'}
                            tableData={buyOrders}
                            emptyMessage={'No account propertes found .'}
                            TableRowComponent={(props) => (
                                <tr className={'traiding-chart'}>
                                    <td>{props.price}</td>
                                    <td>{props.amount}</td>
                                    <td className={'align-right'}>{props.total}</td>
                                </tr>
                            )}
                        />
                    </div>

                </div>
                <div className={'col-md-6 pl-3 pr-0 h-100 d-inline-flex'}>
                    <div className={'form-group-app p-0'}>
                        <CustomTable
                            tableName={'Buy'}
                            header={[
                                {
                                    name: 'PRICE (ETH)',
                                    alignRight: false
                                },{
                                    name: 'AMOUNT (ETH)',
                                    alignRight: false
                                },{
                                    name: 'TOTAL (ETH)',
                                    alignRight: true
                                }
                            ]}
                            className={'mb-3 pt-0 no-min-height no-padding'}
                            tableData={buyOrders}
                            emptyMessage={'No account propertes found .'}
                            TableRowComponent={(props) => (
                                <tr className={'traiding-chart'}>
                                    <td>{props.price}</td>
                                    <td>{props.amount}</td>
                                    <td className={'align-right'}>{props.total}</td>
                                </tr>
                            )}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default PlotDescription;