import React from 'react';

const MarketplaceItem = (props) => (
    <div className='card marketplace card-flexible market'>
        <div className="card-avatar" >

        </div>
        <div className="price-box">
            <div className='price-amount'>
                <div className="amount">
                    200
                </div>
                <div className="currency">
                    APL
                </div>
            </div>
            <div className="user">LittleRocketMan</div>
        </div>
    </div>
);

export default MarketplaceItem;