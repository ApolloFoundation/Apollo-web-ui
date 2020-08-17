// /** ****************************************************************************
//  * Copyright © 2018 Apollo Foundation                                         *
//  *                                                                            *
//  ***************************************************************************** */

// import React from 'react';
// import { connect } from 'react-redux';
// import SiteHeader from '../../../components/site-header';
// import { getBlocksAction } from '../../../../actions/blocks';
// import { getAllCurrenciesAction } from '../../../../actions/currencies';
// import { getTransactionAction } from '../../../../actions/transactions';
// import { setBodyModalParamsAction } from '../../../../modules/modals';
// import { BlockUpdater } from '../../../block-subscriber';
// import CustomTable from '../../../components/tables/table';
// import { getExchangesAction } from '../../../../actions/exchange-booth';

// import Currency from './currency';

// const mapStateToProps = state => ({ account: state.account.account });

// const mapDispatchToProps = dispatch => ({
//   getBlocksAction: requestParams => dispatch(getBlocksAction(requestParams)),
//   getTransactionAction: (type, data) => dispatch(getTransactionAction(type, data)),
//   getAllCurrenciesAction: reqParams => dispatch(getAllCurrenciesAction(reqParams)),
//   setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
//   getExchanges: currency => dispatch(getExchangesAction(currency)),
// });

// class Currencies extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       page: 1,
//       firstIndex: 0,
//       lastIndex: 15,
//       currencies: null,
//     };
//   }

//   componentWillMount() {
//     // getCurrencyTypes(33)
//     this.getCurrencie({
//       account: this.props.account,
//       firstIndex: this.state.firstIndex,
//       lastIndex: this.state.lastIndex,
//     });
//   }

//     listener = data => {
//       this.getCurrencie({
//         account: this.props.account,
//         firstIndex: this.state.firstIndex,
//         lastIndex: this.state.lastIndex,
//       });
//     };

//     getExchanges = async currency => {
//       const { exchanges } = await this.props.getExchanges(currency);

//       if (exchanges) {
//         this.setState({ executedExchanges: exchanges });
//       }
//     };

//     componentDidMount() {
//       BlockUpdater.on('data', this.listener);
//     }

//     componentWillUnmount() {
//       BlockUpdater.removeListener('data', this.listener);
//     }

//     onPaginate = page => {
//       this.getCurrencie({
//         page,
//         account: this.props.account,
//         firstIndex: page * 15 - 15,
//         lastIndex: page * 15,
//       });
//     };

//     getCurrencie = async reqParams => {
//       const allCurrencies = await this.props.getAllCurrenciesAction(reqParams);

//       if (allCurrencies) {
//         this.setState({
//           ...reqParams,
//           currencies: allCurrencies.currencies,
//         });
//       }
//     };

//     render() {
//       return (
//         <div className="page-content">
//           <SiteHeader
//             pageTitle="Currencies"
//           />
//           <div className="page-body container-fluid">
//             <CustomTable
//               header={[
//                 {
//                   name: 'Code',
//                   alignRight: false,
//                 }, {
//                   name: 'Name',
//                   alignRight: false,
//                 }, {
//                   name: 'Type',
//                   alignRight: false,
//                 }, {
//                   name: 'Current Supply',
//                   alignRight: true,
//                 }, {
//                   name: 'Max Supply',
//                   alignRight: true,
//                 }, {
//                   name: 'Actions',
//                   alignRight: true,
//                 },
//               ]}
//               className="mb-3"
//               page={this.state.page}
//               TableRowComponent={Currency}
//               tableData={this.state.currencies}
//               isPaginate
//               previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
//               nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
//               emptyMessage="No currencies found."
//               itemsPerPage={15}
//             />
//           </div>
//         </div>
//       );
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Currencies);
