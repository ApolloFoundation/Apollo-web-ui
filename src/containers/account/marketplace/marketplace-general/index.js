import React from 'react';
import { connect } from 'react-redux';

const MarketplaceGeneral = ({
  purchasedProducts, productsAvaliable, totalPurchases, totalTags,
}) => (
  <div className="card fll-height header ballance">
    <div className="full-box full">
      <div className="full-box-item direction-row">
        <span className="card-title align-left">Purchased products</span>
        <span className="card-title align-right">{purchasedProducts}</span>
      </div>
      <div className="full-box-item direction-row">
        <p className="card-title align-left">Products available</p>
        <p className="card-title align-right">{productsAvaliable}</p>
      </div>
      <div className="full-box-item direction-row">
        <p className="card-title align-left">Total purchases</p>
        <p className="card-title align-right">{totalPurchases}</p>
      </div>
      <div className="full-box-item direction-row">
        <p className="card-title  align-left">Total tags</p>
        <p className="card-title  align-right">{totalTags}</p>
      </div>
    </div>
  </div>
);

const mapStateToProps = state => {
  const marketplaceState = state.marketplace;

  const marketplaceGeneral = marketplaceState ? marketplaceState.marketplaceGeneral : null;

  return { ...marketplaceGeneral };
};

export default connect(mapStateToProps)(MarketplaceGeneral);
