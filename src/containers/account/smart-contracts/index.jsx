/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

 import React, { useState, useCallback, useEffect } from "react";
 import { useDispatch } from "react-redux";
 import { Form, Formik } from "formik";
 import classNames from "classnames";
 import { getContracts } from "../../../actions/contracts";
 import { setBodyModalParamsAction } from "../../../modules/modals";
 import { getSmcSpecification } from "../../../actions/contracts";
 import { formatTimestamp } from "../../../helpers/util/time";
 import SiteHeader from "../../components/site-header";
 import CustomTable from "../../components/tables/table";
 import TableItemContract from "./table-items/contract";
 import TableItemEscrow from "./table-items/escrow";
 import Button from "../../components/button";
 import SearchField from "../../components/form-components/search-field";
 import { TABLE_DATA } from "./table-data";
 
 const SmartContracts = () => {
   const dispatch = useDispatch();
   const [contractList, setContractList] = useState([]);
   const [filteredContractList, setFilteredContractList] = useState([]);
   const [type, setType] = useState("all");
   const [viewContractList, setViewContractList] = useState([]);
   const [pagination, setPagination] = useState({
     page: 1,
     firstIndex: 0,
     lastIndex: 15,
   });
 
   useEffect(() => {
     getContractsList();
   }, []);
 
   const getContractsList = useCallback(async () => {
     const { contracts, errorCode } = await dispatch(getContracts());
 
     if (errorCode) {
       return;
     }
 
     Promise.all(
       contracts.map(async (el) => {
         return await dispatch(getSmcSpecification(el.address));
       })
     )
       .then((data) => {
         const currentOverviewList = data.map((el) =>
           el.members.find((item) => item.name === "symbol")
         );
 
         const currentContractsList = contracts.map((item, index) => {
           return {
             ...item,
             symbol: currentOverviewList[index]
               ? currentOverviewList[index].value
               : "-",
           };
         });
 
         setContractList(currentContractsList);
         setViewContractList(currentContractsList);
       })
       .catch((err) => {
         console.log(err);
       });
   }, [dispatch]);
 
   const onPaginate = (currentPage) => {
     setPagination({
       page: currentPage,
       firstIndex: currentPage * 15 - 15,
       lastIndex: currentPage * 15,
     });
 
     if (filteredContractList.length > 0) {
       setViewContractList([
         ...filteredContractList.slice(currentPage * 15 - 15),
       ]);
       return;
     }
 
     setViewContractList([...contractList.slice(currentPage * 15 - 15)]);
   };
 
   const prevPaginate = () => onPaginate(pagination.page - 1);
   const nextPaginate = () => onPaginate(pagination.page + 1);
 
   const handleSearch = (values) => {
     let isSearch = false;
     const data = Object.entries(values).reduce((acc, [key, value]) => {
       if (value.length > 0) {
         acc[key] = value;
         isSearch = true;
       }
       return acc;
     }, {});
 
     if (!isSearch) {
       setFilteredContractList([]);
       setViewContractList([...contractList]);
       setPagination({
         page: 1,
         firstIndex: 0,
         lastIndex: 15,
       });
       return;
     }
 
     const filtersList = Object.entries(data);
 
     const list = contractList.filter((item) =>
       filtersList.every(([key, value]) => {
         if (key === "publish") {
           return (
             dispatch(formatTimestamp(new Date(item.timestamp))) === value.trim()
           );
         }
 
         return item[key].toLowerCase().includes(value.toLowerCase());
       })
     );
 
     setFilteredContractList(list);
     setViewContractList(list);
     setPagination({
       page: 1,
       firstIndex: 0,
       lastIndex: 15,
     });
   };
 
   const handleTransactionFilters = (currType) => {
     setType(currType);
 
     if (currType === "all") {
       setFilteredContractList([]);
       setViewContractList([...contractList]);
     } else if (currType === "token") {
       const filteredlist = contractList.filter((item) => item.baseContract.startsWith("APL20"));
       setFilteredContractList(filteredlist);
       setViewContractList(filteredlist);
     } else if (currType === "escrow") {
       const filteredlist = contractList.filter((item) => item.baseContract.startsWith("TokenEscrow"));
       setFilteredContractList(filteredlist);
       setViewContractList(filteredlist);
     }
 
     setPagination({
       page: 1,
       firstIndex: 0,
       lastIndex: 15,
     });
   };
 
   const handleCreateToken = useCallback(() => {
     dispatch(setBodyModalParamsAction("SMC_CREATE_TOKEN", null));
   }, [dispatch]);
 
   return (
     <div className="page-content">
       <SiteHeader pageTitle={"Contracts"}>
         <Button
           id={"button-smart-contracts-cteate-token"}
           name="Create token"
           className="mr-2"
           color="green"
           size="sm"
           onClick={handleCreateToken}
         />
         <Button
           id={"button-smart-contracts-cteate-token"}
           name="Create escrow"
           className="mr-2"
           color="green"
           size="sm"
           onClick={handleCreateToken}
         />
       </SiteHeader>
       <div className="page-body container-fluid">
         <div className="transactions-filters">
           <div className="top-bar mb-4">
             {TABLE_DATA.type.map((item) => (
               <div
                 className={classNames({
                   btn: true,
                   filter: true,
                   active: type === item.type,
                 })}
                 onClick={() => handleTransactionFilters(item.type, null)}
               >
                 {item.name}
               </div>
             ))}
           </div>
           <div className="search-bar">
             <Formik onSubmit={handleSearch} initialValues={{}}>
               {({ values, setValue }) => {
                 return (
                   <Form className="form-group-app input-group-app transparent mb-0 row">
                     <div className=" col-md p-0 pr-md-3">
                       <SearchField
                         name={"address"}
                         field="address"
                         placeholder="address"
                         setValue={setValue}
                       />
                     </div>
                     {type !== "escrow" && (
                       <div className=" col-md p-0 pr-md-3">
                         <SearchField
                           name={"symbol"}
                           field="symbol"
                           placeholder="symbol"
                           setValue={setValue}
                         />
                       </div>
                     )}
                     <div className=" col-md p-0">
                       <SearchField
                         name={"publish"}
                         field="publish"
                         placeholder="publish"
                         setValue={setValue}
                       />
                     </div>
                   </Form>
                 );
               }}
             </Formik>
           </div>
         </div>
         <div className="card full-height">
           <div class="card-body">
             <CustomTable
               id={"smart-contracts-tokens"}
               header={type === "escrow" ? TABLE_DATA.head.escrow : TABLE_DATA.head.token}
               className={"no-min-height"}
               emptyMessage={"No Smart Contracts found."}
               TableRowComponent={type === "escrow" ? TableItemEscrow : TableItemContract}
               tableData={viewContractList}
               page={pagination.page}
               isPaginate
               previousHendler={prevPaginate}
               nextHendler={nextPaginate}
               itemsPerPage={15}
             />
           </div>
         </div>
       </div>
     </div>
   );
 };
 export default SmartContracts;