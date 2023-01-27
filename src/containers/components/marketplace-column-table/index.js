import React from 'react';
import classNames from 'classnames';
import ContentHendler from 'containers/components/content-hendler';
import MarketplaceItem from "containers/account/marketplace/marketplace-card";

const MarketplaceColumnTable = ({data, page, itemsPerPage = 15, onPaginate, deliver, emptyMessage, ...props}) => (
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
                                {...props}
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
                            onClick={onPaginate && onPaginate.bind(this, page - 1)}
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
                            onClick={onPaginate && onPaginate.bind(this, page + 1)}
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