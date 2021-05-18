/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { connect } from "react-redux";
import SiteHeader from "../../components/site-header";
import { ContractTableItem } from "./contract-table-item";
import { getContracts } from "../../../actions/contracts";
import { BlockUpdater } from "../../block-subscriber/index";
import { setBodyModalParamsAction } from "../../../modules/modals";
import CustomTable from "../../components/tables/table";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => ({
  account: state.account.account,
  accountRS: state.account.accountRS,
});

const mapDispatchToProps = (dispatch) => ({
  getContracts: (requestParams) => dispatch(getContracts(requestParams)),
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class SmartContracts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstIndex: 0,
      lastIndex: 15,
      page: 1,
      contracts: [],
    };
  }

  componentDidMount() {
    this.getMyContracts(this.props.account);
    BlockUpdater.on("data", (data) => {
      this.getMyContracts(this.props.account);
    });
  }

  componentWillUnmount() {
    BlockUpdater.removeAllListeners("data");
  }

  getMyContracts = async (reqParams) => {
    const myContracts = await this.props.getContracts(reqParams);

    if (myContracts) {
      this.setState({
        ...this.props,
        contracts: myContracts.contracts,
      });
    }
  };

  onPaginate = (page) => {
    this.setState({
      page: page,
      account: this.props.account,
      firstIndex: page * 15 - 15,
      lastIndex: page * 15,
    });
  };

  render() {
    return (
      <div className="page-content">
        <SiteHeader pageTitle={"Smart Contracts"}>
          <Link
            to={"/smart-contracts/create"}
            className="btn btn-green btn-sm"
            style={{ marginLeft: 15 }}
          >
            Create New Contract
          </Link>
          <button
            type={"button"}
            className="btn btn-green btn-sm"
            style={{ marginLeft: 15 }}
            onClick={() =>
              this.props.setBodyModalParamsAction("CREATE_SMC_EXECUTION", {})
            }
          >
            Send message
          </button>
        </SiteHeader>
        <div className="page-body container-fluid">
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
            page={this.state.page}
            TableRowComponent={ContractTableItem}
            tableData={this.state.contracts}
            isPaginate
            previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
            nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
            itemsPerPage={15}
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SmartContracts);
