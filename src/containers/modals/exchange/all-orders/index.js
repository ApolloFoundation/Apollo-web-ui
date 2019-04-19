/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {getAllMyOffers} from "../../../../actions/wallet";
import ModalBody from "../../../components/modals/modal-body";
import CustomTable from "../../../components/tables/table";
import {formatDivision} from "../../../../helpers/format";

class MyAllOrders extends React.Component {
    state = {
        offers: null,
    };

    componentDidMount() {
        this.handleAllMyOffers();
    }

    handleAllMyOffers = async () => {
        const offers = await this.props.getAllMyOffers();
        this.setState({offers});
    };

    render() {
        return (
            <ModalBody
                modalTitle={'My all orders'}
                closeModal={this.props.closeModal}
                isDisableFormFooter
                isDisableSecretPhrase
                className={'exchange'}
            >
                <CustomTable
                    header={[
                        {
                            name: 'Price',
                            alignRight: false
                        },{
                            name: 'Amount',
                            alignRight: false
                        },{
                            name: 'Total',
                            alignRight: false
                        },{
                            name: 'Status',
                            alignRight: true
                        }
                    ]}
                    className={'no-min-height transparent pt-4'}
                    emptyMessage={'No created orders.'}
                    tableData={this.state.offers ? this.state.offers : null}
                    TableRowComponent={(props) => {
                        const pairRate = formatDivision(props.pairRate, 100000000, 9);
                        const offerAmount = formatDivision(props.offerAmount, 100000000, 3);
                        const total = formatDivision(props.pairRate * props.offerAmount, Math.pow(10, 16), 9);
                        const currentTime = new Date();
                        console.log('-------', currentTime, props.finishTime)
                        return (
                            <tr>
                                <td className={`${props.type === 1 ? 'red-text' : 'green-text'}`}>{pairRate}</td>
                                <td>{offerAmount}</td>
                                <td>{total}</td>
                                <td className={'align-right'}>{props.finishTime < currentTime ? 'Expired' : 'Active'}</td>
                            </tr>
                        )
                    }}
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    getAllMyOffers: () => dispatch(getAllMyOffers()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAllOrders);
