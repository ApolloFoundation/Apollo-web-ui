// /******************************************************************************
//  * Copyright © 2018 Apollo Foundation                                         *
//  *                                                                            *
//  ******************************************************************************/


// import React from 'react';
// import SiteHeader from '../../components/site-header'
// import TransferHistoryItem from './transfer-history-item'
// import classNames from "classnames";
// import { v4 as uuidv4 } from 'uuid';
// import {connect} from 'react-redux'
// import InfoBox from '../../components/info-box';
// import ContentHendler from '../../components/content-hendler'

// import {getTransferHistory} from "../../../actions/currencies";
// import {setBodyModalParamsAction} from "../../../modules/modals";
// import {getTransactionAction} from "../../../actions/transactions";
// import {BlockUpdater} from "../../block-subscriber";
// import ContentLoader from '../../components/content-loader'

// import CustomTable from '../../components/tables/table';


// const mapStateToProps = state => ({
//     account: state.account.account,
//     accountRS: state.account.accountRS,
// });

// const mapDispatchToProps = dispatch => ({
//     getTransferHistory: (requestParams) => dispatch(getTransferHistory(requestParams)),
//     getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
//     setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
// });

// class TransferHistoryCurrency extends React.Component {
//     constructor(props) {
//         super(props);

//         this.getAssets = this.getAssets.bind(this);
//         this.getTransaction = this.getTransaction.bind(this);
//     }

//     state = {
//         transfers: null,
//         page: 1,
//         firstIndex: 0,
//         lastIndex: 15,
//     };

//     componentWillMount() {
//         this.getAssets({
//             firstIndex: this.state.firstIndex,
//             lastIndex: this.state.lastIndex,
//             account: this.props.accountRS,
//         });
//         BlockUpdater.on("data", data => {
//             console.warn("height in dashboard", data);
//             console.warn("updating dashboard");
//             this.getAssets({
//                 firstIndex: this.state.firstIndex,
//                 lastIndex: this.state.lastIndex,
//                 account: this.props.accountRS,
//             })
//         });
//     }

//     componentWillUnmount() {
//         BlockUpdater.removeAllListeners('data');
//     }

//     componentWillReceiveProps() {

//         this.getAssets({
//             account: this.props.accountRS,
//             firstIndex: this.state.firstIndex,
//             lastIndex:  this.state.lastIndex
//         })
//     }

//     onPaginate = (page) => {
//         let reqParams = {
//             ...this.props,
//             page: page,
//             account: this.props.account,
//             firstIndex: page * 15 - 15,
//             lastIndex:  page * 15
//         };

//         this.setState(reqParams, () => {
//             this.getAssets(reqParams)
//         });
//     };

//     async getAssets(requestParams) {
//         const transfers = await this.props.getTransferHistory(requestParams);

//         if (transfers) {
//             this.setState({
//                 ...this.props,
//                 transfers: transfers.transfers
//             })
//         }
//     }

//     async getTransaction(data) {
//         const reqParams = {
//             transaction: data,
//             account: this.props.account
//         };

//         const transaction = await this.props.getTransactionAction(reqParams);
//         if (transaction) {
//             this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
//         }

//     }

//     render () {
//         return (
//             <div className="page-content">
//                 <SiteHeader
//                     pageTitle={'Transfer History'}
//                 />
//                 <div className="page-body container-fluid">
//                     <CustomTable
//                         header={[
//                             {
//                                 name: 'Transaction',
//                                 alignRight: false
//                             },{
//                                 name: 'Currency',
//                                 alignRight: false
//                             },{
//                                 name: 'Date',
//                                 alignRight: false
//                             },{
//                                 name: 'Units',
//                                 alignRight: true
//                             },{
//                                 name: 'Recipient',
//                                 alignRight: false
//                             },{
//                                 name: 'Sender',
//                                 alignRight: false
//                             }
//                         ]}
//                         emptyMessage={'No transfer history found.'}
//                         page={this.state.page}
//                         className={'mb-3'}
//                         TableRowComponent={TransferHistoryItem}
//                         tableData={this.state.transfers}
//                         isPaginate
//                         previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
//                         nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
//                         itemsPerPage={15}
//                     />
//                 </div>
//             </div>
//         );
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(TransferHistoryCurrency);
