import React from 'react';

const TopPageBlocks = ({cards}) => (
    <div className="row top-blocks ">
        {
            cards.map((el, index) => 
                <div className="col-md-6 col-lg-6 col-xl-3 pb-3 h-100">
                    <div className={`card header ballance justify-content-start h-100 chart-sprite position-${index + 1} ${index === 0 ? 'ballance' : ''} ${index === 1 ? 'assets' : ''} ${index === 2 ? 'currencies' : ''} ${index === 3 ? 'coins' : ''}`}>
                        {
                            !(el.value instanceof Array) && 
                            <>
                                <div className="card-title">{el.label}</div>
                                <div className="amount">{el.value}</div>
                            </>
                        }
                        {
                            el.value instanceof Array && 
                            el.value.map(instance => 
                                <>
                                    <div className="card-title">{instance.label}</div>
                                    <div className="amount">{instance.value}</div>
                                </>    
                            ) 
                        }
                    </div>
                </div>
            )
        }
    </div>
)

export default TopPageBlocks;