/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { connect } from "react-redux";
import SiteHeader from "../../components/site-header";
import { getMyPollsAction, getVoteAction } from "../../../actions/polls";
import PoolItem from "./pool-item";
import { getTransactionAction } from "../../../actions/transactions";
import { setBodyModalParamsAction } from "../../../modules/modals";
import { BlockUpdater } from "../../block-subscriber/index";

import CustomTable from "../../components/tables/table";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => ({
  account: state.account.account,
  accountRS : state.account.accountRS
});

const mapDispatchToProps = (dispatch) => ({
  getMyPollsAction: (reqParams) => dispatch(getMyPollsAction(reqParams)),
  getTransactionAction: (requestParams) =>
    dispatch(getTransactionAction(requestParams)),
  getVoteAction: (requestParams) => dispatch(getVoteAction(requestParams)),
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
      myPolls: null,
    };
  }

  componentDidMount() {
    this.getMyPolls({
      account: this.props.account,
      includeFinished: true,
    });
    BlockUpdater.on("data", (data) => {
      this.getMyPolls({
        account: this.props.account,
        includeFinished: true,
      });
    });
  }

  componentWillUnmount() {
    BlockUpdater.removeAllListeners("data");
  }

  getMyPolls = async (reqParams) => {
    const myPolls = await this.props.getMyPollsAction(reqParams);

    if (myPolls) {
      this.setState({
        ...this.props,
        myPolls: myPolls.polls,
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
    console.log(this.props.accountRS)
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
                name: "Short Hash",
                alignRight: false,
              },
              {
                name: "Created",
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
            TableRowComponent={PoolItem}
            tableData={this.state.myPolls}
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
