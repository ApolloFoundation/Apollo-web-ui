/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setBodyModalParamsAction, setModalType } from '../../../../modules/modals';
import { getAskOrders, getBidOrders } from '../../../../actions/marketplace';
import { numberToLocaleString } from 'helpers/format';

class AssetItem extends React.Component {
    state = {};

    constructor(props) {
      super(props);

      this.getAskOrders();
      this.getBidOrders();
    }

    componentWillReceiveProps() {
      this.getAskOrders();
      this.getBidOrders();
    }

    getAskOrders = async () => {
      const { asset } = this.props;

      const askOrders = await this.props.getAskOrders(asset);

      if (askOrders && askOrders.orders) {
        let orders = Math.min(...askOrders.orders.map(el => el.priceATM));

        orders = isFinite(orders) ? orders : null;

        this.setState({ lowestAskOrder: orders });
      }
    };

    getBidOrders = async () => {
      const { asset } = this.props;

      const bidOrders = await this.props.getBidOrders(asset);

      if (bidOrders && bidOrders.orders) {
        let orders = Math.max(...bidOrders.orders.map(el => el.priceATM));

        orders = isFinite(orders) ? orders : null;

        this.setState({ highestBidOrder: orders });
      }
    };

    close = () => {
      if (this.props.closeModal) {
        this.props.closeModal();
      }
    };

    gotToAsset = () => {
      const { asset, history, setBodyModalParamsAction } = this.props;

      setBodyModalParamsAction();
      history.push(`/asset-exchange/${asset}`);
    };

    render() {
      const {
        decimals, asset, name, unconfirmedQuantityATU, quantityATU,
      } = this.props;

      return (
        <tr key={uuidv4()}>
          <td className="blue-link-text">
            <span
              className="cursor-pointer blue-link-text"
              onClick={this.gotToAsset}
            >
              {name}
            </span>
          </td>
          <td>
            {numberToLocaleString((unconfirmedQuantityATU / Math.pow(10, decimals)), {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </td>
          <td>
            {numberToLocaleString((quantityATU / Math.pow(10, decimals)), {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </td>
          <td>
            {((parseInt(unconfirmedQuantityATU) / parseInt(quantityATU)) * 100).toFixed(2)}
            &nbsp;%
          </td>
          <td>
            {
              !!(this.state.lowestAskOrder / Math.pow(10, 8) * Math.pow(10, decimals))
              && numberToLocaleString((this.state.lowestAskOrder / Math.pow(10, 8) * Math.pow(10, decimals)), {
                  minimumFractionDigits: decimals,
                  maximumFractionDigits: decimals,
                })
            }
          </td>
          <td>
            {
              !!(this.state.highestBidOrder / Math.pow(10, 8) * Math.pow(10, decimals))
              && numberToLocaleString((this.state.highestBidOrder / Math.pow(10, 8) * Math.pow(10, decimals)), {
                  minimumFractionDigits: decimals,
                  maximumFractionDigits: decimals,
                })
            }
          </td>
          <td>
            {
              !!(this.state.highestBidOrder / Math.pow(10, 8) * Math.pow(10, decimals))
              && numberToLocaleString(((this.state.highestBidOrder / Math.pow(10, 8) * Math.pow(10, decimals))
                  * (quantityATU / Math.pow(10, decimals))), {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              })
            }
          </td>
        </tr>
      );
    }
}

const mapDispatchToProps = dispatch => ({
  setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  setModalType: type => dispatch(setModalType(type)),
  getAskOrders: asset => getAskOrders(asset),
  getBidOrders: asset => getBidOrders(asset),
});

export default connect(null, mapDispatchToProps)(withRouter(AssetItem));
