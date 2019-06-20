import React from 'react';
import ContentHendler from '../content-hendler';
import classNames from 'classnames';

import MarketplaceItem from "../../account/marketplace/marketplace-card";

const MarketplaceColumnTable = ({data, page, itemsPerPage = 15, deliver, emptyMessage}) => (
    <>
        <ContentHendler
            items={data}
            emptyMessage={emptyMessage}
        >
            {
                data &&
                !!data.length &&
                <>
                    {data.map((el, index) => (
                        <div
                            key={`marketplace-item-${index}`}
                            className={'marketplace-item'}
                        >
                            <MarketplaceItem
                                tall={true}
                                fluid={true}
                                deliver={deliver}
                                index={index}
                                {...el}
                            />
                        </div>
                    ))}
                    <div className="btn-box pagination">
                        <button
                            type={'button'}
                            className={classNames({
                                'btn btn-default' : true,
                                'disabled' : page <= 1,
                            })}
                        >
                            Previous
                        </button>
                        <div className='pagination-nav'>
                            <span>{page * itemsPerPage  - itemsPerPage + 1}</span>
                            <span>&hellip;</span>
                            <span>{(page * itemsPerPage - itemsPerPage) + data.length}</span>
                        </div>
                        <button
                            type={'button'}
                            className={classNames({
                                'btn btn-default' : true,
                                'disabled' : data.length < itemsPerPage,
                            })}
                        >
                            Next
                        </button>
                    </div>
                </>
            }
        </ContentHendler>
    </>
)

export default MarketplaceColumnTable;