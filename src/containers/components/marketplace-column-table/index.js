import React from 'react';
import ContentLoader from '../content-loader';
import classNames from 'classnames';
import uuid from 'uuid';
import InfoBox from '../../components/info-box';
import MarketplaceItem from "../../account/marketplace/marketplace-card";

const MarketplaceColumnTable = ({data, page, deliver}) => (
    <>
        {
            data &&
            !!data.length &&
            <>
                {
                    data.map((el, index) => {
                        return (
                            <MarketplaceItem
                                key={uuid()}
                                tall={false}
                                fluid={true}
                                isHovered
                                deliver={deliver}
                                index={index}
                                {...el}
                            />
                        );
                    })
                }
                <div className="btn-box relative right-conner align-right mt-4">
                    <a
                        className={classNames({
                            'btn' : true,
                            'btn-left' : true,
                            'disabled' : page <= 1
                        })}
                        // onClick={this.onPaginate.bind(this, this.state.page - 1)}
                    > 
                        Previous
                    </a>
                    <div className='pagination-nav'>
                        <span>{page * 15 - 15 + 1}</span>
                        <span>&hellip;</span>
                        <span>{(page * 15 - 15) + (data.length)}</span>
                    </div>
                    <a
                        // onClick={this.onPaginate.bind(this, this.state.page + 1)}
                        className={classNames({
                            'btn' : true,
                            'btn-right' : true,
                            'disabled' : data.length < 8
                        })}
                    >
                        Next
                    </a>
                </div>
            </> ||
            <ContentLoader/>
        }
        {
            data &&
            !(!!data.length) &&
            <InfoBox
                default
            >
                No pending orders.
            </InfoBox>
        }
    </>
)

export default MarketplaceColumnTable;