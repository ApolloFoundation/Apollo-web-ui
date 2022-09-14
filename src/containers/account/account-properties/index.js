// /******************************************************************************
//  * Copyright © 2018 Apollo Foundation                                         *
//  *                                                                            *
//  ******************************************************************************/


// import React from 'react';
// import SiteHeader from '../../components/site-header';
// import {connect} from 'react-redux';
// import { v4 as uuidv4 } from 'uuid';
// import {getAccountPropertiesAction} from '../../../actions/account/index';
// import InfoBox from '../../components/info-box';
// import {setBodyModalParamsAction} from "../../../modules/modals";
// import ContentLoader from '../../components/content-loader'
// import ContentHendler from '../../components/content-hendler'

// import AccountProperty from './acocunt-property';
// import CustomTable from '../../components/tables/table';

// const mapStateToProps = state => ({
//     account: state.account.account
// });

// const mapDisatchToProps = dispatch => ({
//     getAccountPropertiesAction: (requsetParams) => dispatch(getAccountPropertiesAction(requsetParams)),
//     setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
// });

// const initialPagination = {
//     page: 1,
//     firstIndex: 0,
//     lastIndex: 15,
// };

// class AccountProperties extends React.Component {
//     state = {
//         properties: null,
//         recipientRS: null,
//         setterRS: null,
//         incoming: true,
//         ...initialPagination,
//     };

//     componentDidMount() {
//         this.getAccountPropertiesIncoming();
//     }

//     componentWillReceiveProps (newState) {
//         if (this.state.incoming) this.getAccountPropertiesIncoming(newState);
//         else this.getAccountPropertiesOutgoing(newState);
//     }

//     getAccountPropertiesIncoming = async (newState, pagination) => {
//         if (!newState) newState = this.props;
//         if (!pagination) {
//             pagination = {
//                 firstIndex: this.state.firstIndex,
//                 lastIndex: this.state.lastIndex,
//             }
//         }
//         const properties = await this.props.getAccountPropertiesAction({
//             recipient: newState.account,
//             firstIndex: pagination.firstIndex,
//             lastIndex: pagination.lastIndex,
//         });

//         if (properties) {
//             this.setState({
//                 ...pagination,
//                 properties: properties.properties,
//                 recipientRS: properties.recipientRS,
//                 incoming: true
//             })
//         }
//     };

//     getAccountPropertiesOutgoing = async (newState, pagination) => {
//         if (!newState) newState = this.props;
//         if (!pagination) {
//             pagination = {
//                 firstIndex: this.state.firstIndex,
//                 lastIndex: this.state.lastIndex,
//             }
//         }
//         const properties = await this.props.getAccountPropertiesAction({
//             setter: newState.account,
//             firstIndex: pagination.firstIndex,
//             lastIndex: pagination.lastIndex,
//         });

//         if (properties) {
//             this.setState({
//                 ...pagination,
//                 properties: properties.properties,
//                 setterRS: properties.setterRS,
//                 incoming: false
//             })
//         }
//     };

//     setProperty  = () => this.props.setBodyModalParamsAction("SET_ACCOUNT_PROPERTY", {});

//     onPaginate = (page) => {
//         const pagination = {
//             page: page,
//             firstIndex: page * 15 - 15,
//             lastIndex: page * 15
//         };
//         this.getAccountPropertiesIncoming(null, pagination);
//     };

//     render () {
//         return (
//             <div className="page-content">
//                 <SiteHeader
//                     pageTitle={'Account properties'}
//                 >
//                     <a className={`btn ${this.state.incoming ? 'outline-primary' : 'outline-transparent'} mr-1`}
//                        onClick={() => this.getAccountPropertiesIncoming(null, initialPagination)}>
//                         Incoming
//                     </a>
//                     <a className={`btn ${this.state.incoming ? 'outline-transparent' : 'outline-primary'} mr-1`}
//                        onClick={() => this.getAccountPropertiesOutgoing(null, initialPagination)}>
//                         Outgoing
//                     </a>
//                     <button
//                         type={'button'}
//                         className={'btn btn-green btn-sm'}
//                         onClick={this.setProperty}>
//                         Set
//                     </button>
//                 </SiteHeader>
//                 <div className="page-body container-fluid">
//                     <CustomTable
//                         header={[
//                             {
//                                 name: `${this.state.incoming ? 'Setter' : 'Recipient'}`,
//                                 alignRight: false
//                             },{
//                                 name: 'Property',
//                                 alignRight: false
//                             },{
//                                 name: 'Value',
//                                 alignRight: false
//                             },{
//                                 name: 'Actions',
//                                 alignRight: true
//                             }
//                         ]}
//                         className={'mb-3'}
//                         emptyMessage={'No account properties found .'}
//                         TableRowComponent={(props) => <AccountProperty incoming={this.state.incoming} {...props}/>}
//                         tableData={this.state.properties}
//                         isPaginate
//                         page={this.state.page}
//                         previousHendler={() => this.onPaginate(this.state.page - 1)}
//                         nextHendler={() => this.onPaginate(this.state.page + 1)}
//                         itemsPerPage={15}
//                     />
//                 </div>
//             </div>
//         );
//     }
// }

// export default connect(mapStateToProps, mapDisatchToProps)(AccountProperties);
