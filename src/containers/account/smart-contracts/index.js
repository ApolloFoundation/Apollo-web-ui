/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

 import React, { useState, useCallback, useEffect } from "react";
 import SiteHeader from "../../components/site-header";
 import { ContractTableItem } from "./contract-table-item";
 import { useSelector, useDispatch } from "react-redux";
 import { getContracts } from "../../../actions/contracts";
 import { setBodyModalParamsAction } from "../../../modules/modals";
 import CustomTable from "../../components/tables/table";
 import { Link } from "react-router-dom";
 import { Form, Text } from "react-form";
 
 const SmartContracts = () => {
   const dispatch = useDispatch();
 
   const { account } = useSelector((state) => state.account);
 
   const [contractList, setContractList] = useState(null);
   const [perPage, setPerPage] = useState(1);
   const [pagination, setPagination] = useState({
     page: 1,
     firstIndex: 0,
     lastIndex: 15,
   });
 
   const getMyContracts = useCallback(async () => {
     const myContracts = await dispatch(getContracts(account));
     if (myContracts) {
       setContractList(myContracts.contracts);
     }
   }, [dispatch]);
 
   const formatData = () => {
     const indexOfLastPost = pagination.page * perPage;
     const indexOfFirstPage = indexOfLastPost - perPage;
 
     const currentPosts = contractList.slice(indexOfFirstPage, indexOfLastPost);
     setContractList(currentPosts);
   };
 
   useEffect(() => {
     getMyContracts();
   }, []);
 
   const onPaginate = (currentPage) => {
     setPagination((prevState) => ({
       ...prevState,
       page: currentPage,
     }));
     formatData();
   };
 
   const prevPaginate = () => onPaginate(pagination.page - 1);
 
   const nextPaginate = () => onPaginate(pagination.page + 1);
 
   const handleSendMessage = () => {
     dispatch(setBodyModalParamsAction("SMC_CREATE", {}));
   };
   const handleSearchByAccount = (values) => console.log(values);
   const handleSearchByQuery = (values) => console.log(values);
   return (
     <div className="page-content">
       <SiteHeader pageTitle={"Smart Contracts"}>
         <Link
           to={"/smart-contracts/create"}
           className="btn btn-green btn-sm ml-3"
         >
           Create New Contract
         </Link>
         <button
           type={"button"}
           className="btn btn-green btn-sm ml-3"
           onClick={handleSendMessage}
         >
           Send message
         </button>
       </SiteHeader>
       <div className="page-body container-fluid">
         <div className="row">
           <div className="col-md-12 p-0 mb-15">
             <div className="transactions-filters p-0">
               <div className="search-bar row">
                 <Form
                   onSubmit={(values) => handleSearchByAccount(values)}
                   render={({ submitForm, setAllValues, setValue }) => {
                     return (
                       <form
                         onSubmit={submitForm}
                         className="input-group-app search col-md-3 pl-0"
                       >
                         <div className="iconned-input-field">
                           <Text
                             placeholder={"Address ID"}
                             defaultValue={""}
                             field={"address"}
                             type="text"
                           />
                           <button type={"submit"} className="input-icon">
                             <i className="zmdi zmdi-search" />
                           </button>
                         </div>
                       </form>
                     );
                   }}
                 />
                 <Form
                   onSubmit={(values) => handleSearchByQuery(values)}
                   render={({ submitForm, setAllValues, setValue }) => {
                     return (
                       <form
                         onSubmit={submitForm}
                         className="input-group-app search col-md-3 pl-0"
                       >
                         <div className="iconned-input-field">
                           <Text
                             placeholder={"Name"}
                             field={"name"}
                             type="text"
                           />
                           <button type={"submit"} className="input-icon">
                             <i className="zmdi zmdi-search" />
                           </button>
                         </div>
                       </form>
                     );
                   }}
                 />
               </div>
             </div>
           </div>
           <CustomTable
             header={[
               {
                 name: "Adress",
                 alignRight: false,
               },
               {
                 name: "Name",
                 alignRight: false,
               },
               {
                 name: "Args",
                 alignRight: false,
               },
               {
                 name: "Fuels limit/price",
                 alignRight: false,
               },
               {
                 name: "Transaction id",
                 alignRight: false,
               },
               {
                 name: "Amount",
                 alignRight: false,
               },
               {
                 name: "Short Hash",
                 alignRight: false,
               },
               {
                 name: "Published",
                 alignRight: false,
               },
               {
                 name: "Status",
                 alignRight: false,
               },
               {
                 name: "Action",
                 alignRight: true,
               },
             ]}
             className={"no-min-height mb-3"}
             emptyMessage={"No Smart Contracts found."}
             page={pagination.page}
             TableRowComponent={ContractTableItem}
             tableData={contractList}
             isPaginate
             previousHendler={prevPaginate}
             nextHendler={nextPaginate}
             itemsPerPage={15}
           />
         </div>
       </div>
     </div>
   );
 };
 
 export default SmartContracts;