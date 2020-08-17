// import React, {Component} from 'react';
// import {Link} from 'react-router-dom';
// import {connect} from "react-redux";
// import {NotificationManager} from "react-notifications";
// import {CopyToClipboard} from 'react-copy-to-clipboard';
// import {setBodyModalParamsAction} from '../../../../../modules/modals';
// import {exportWallet} from "../../../../../actions/wallet";

// class CurrencyDescriptionComponent extends Component {
//     handleWithdrawModal = () => {
//         this.props.setBodyModalParamsAction('WITHDRAW_CURRENCY', {
//             balances: this.props.balances,
//             address: this.props.address,
//         });
//     };

//     handleExport = async () => {
//         this.props.setBodyModalParamsAction('CONFIRM_EXPORT_WALLET', {
//             ethAddress: this.props.address
//         });
//     };

//     render() {
//         const {address, balances, currency, handleCurrentCurrency} = this.props;
//         return (
//             <tr>
//                 <td>
//                     <CopyToClipboard
//                         text={address}
//                         onCopy={() => {
//                             NotificationManager.success('The wallet address has been copied to clipboard.')
//                         }}
//                     >
//                         <span className="cursor-pointer">{address}</span>
//                     </CopyToClipboard>
//                 </td>
//                 <td>{balances.eth}</td>
//                 <td>{balances.pax}</td>
//                 <td>
//                     <div className="btn-box inline">
//                         <Link
//                             to={'/dex'}
//                             className="btn primary bg-success"
//                             onClick={() => handleCurrentCurrency(currency)}
//                         >
//                             Buy
//                         </Link>
//                     </div>
//                 </td>
//                 <td>
//                     <div className="btn-box inline">
//                         <Link
//                             to={'/dex'}
//                             className="btn primary bg-danger"
//                             onClick={() => handleCurrentCurrency(currency)}
//                         >
//                             Sell
//                         </Link>
//                     </div>
//                 </td>
//                 <td>
//                     <div className="btn-box inline">
//                         <a
//                             className="btn primary defaullt"
//                             onClick={() => NotificationManager.error('This functionality will be delivered in future releases.', 'Error', 5000)}
//                         >
//                             View History
//                         </a>
//                     </div>
//                 </td>
//                 <td className={'align-right'}>
//                     <div className="btn-box inline pr-1">
//                         <a
//                             className="btn primary defaullt"
//                             onClick={this.handleExport}
//                         >
//                             Export
//                         </a>
//                         <a
//                             className="btn primary defaullt"
//                             onClick={this.handleWithdrawModal}
//                         >
//                             Withdraw
//                         </a>
//                         <CopyToClipboard
//                             text={address}
//                             onCopy={() => {
//                                 NotificationManager.success('The wallet address has been copied to clipboard.')
//                             }}
//                         >
//                             <a
//                                 className="btn btn-green"
//                             >
//                                 Deposit
//                             </a>
//                         </CopyToClipboard>
//                     </div>
//                 </td>
//             </tr>
//         )
//     }
// }

// const mapStateToProps = ({account}) => ({
//     account: account.account,
//     passPhrase: account.passPhrase,
//     is2FA: account.is2FA,
// });

// const mapDispatchToProps = dispatch => ({
//     setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
//     exportWallet: (params) => dispatch(exportWallet(params)),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(CurrencyDescriptionComponent);
