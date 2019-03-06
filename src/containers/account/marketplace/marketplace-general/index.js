import React from 'react';

const MarketplaceGeneral = ({getDGSPurchaseCount, getDGSGoodsCount, getDGSPurchasesCount, getDGSTagCount}) => (
    <div className="card fll-height header ballance">
        <div className="full-box full">
            <div className="full-box-item direction-row">
                <span className="card-title align-left">Purchased products</span>
                <span className="card-title align-right">{getDGSPurchaseCount}</span>
            </div>
            <div className="full-box-item direction-row">
                <p className="card-title align-left">Products available</p>
                <p className="card-title align-right">{getDGSGoodsCount}</p>
            </div>
            <div className="full-box-item direction-row">
                <p className="card-title align-left">Total purchases</p>
                <p className="card-title align-right">{getDGSPurchasesCount}</p>
            </div>
            <div className="full-box-item direction-row">
                <p className="card-title  align-left">Total tags</p>
                <p className="card-title  align-right">{getDGSTagCount}</p>
            </div>
        </div>
    </div>
);

export default MarketplaceGeneral;