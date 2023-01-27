/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import classNames from 'classnames';
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import {setBodyModalParamsAction} from "modules/modals";
import {formatTimestamp} from "helpers/util/time";
import utils from "helpers/util/utils";
import config from 'config';
import { getDecimalsSelector, getTickerSelector } from 'selectors';
import { numberToLocaleString } from 'helpers/format';

const MarketplaceItem = (props) => {
    const dispatch = useDispatch();
    const decimals = useSelector(getDecimalsSelector);
    const ticker = useSelector(getTickerSelector);
    const tagsArr = utils.parseStringBySpace(props.tags);

    const handlePrice = () => {
        const result = props.priceATM / decimals;
        return numberToLocaleString(result, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 20,
            useGrouping: false,
        });
    }

    const handleMarketplacePurchase = (args) => () => dispatch(setBodyModalParamsAction('MARKETPLACE_PURCHASE', args));

    const handleMarketplaceImage = () => dispatch(setBodyModalParamsAction('MARKETPLACE_IMAGE', props.goods));

    const handleMarketPlaceGoodDetails = () => dispatch(setBodyModalParamsAction('MARKETPLACE_GOOD_DETAILS', props.goods));

    const handleMarketplaceAccountInfo = (accountAddress) => () => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', accountAddress));

    const handleMarketplaceGoodsDeliver = () => dispatch(setBodyModalParamsAction('MARKETPLACE_GOODS_DELIVER', props.purchase))

    const handleTime = (time) => dispatch(formatTimestamp(time));

    return (
        <div className='w-100 h-100'>
            <div
                className={classNames({
                    'card green': true,
                    // 'position-md-absolute': !props.fluid,
                    'position-sm-static': true,
                    'marketplace': true,
                    'market': true,
                    // 'hovered': props.isHovered,
                    'relative': props.relative,
                    'full-height': props.fullHeight,
                    'tall-card': props.tall,
                    'card-fluid': props.fluid,
                    "is-last-row": (props.index >= 4 && window.innerWidth > 1000) || (props.index > 2 && window.innerWidth > 720 && window.innerWidth < 1000)
                })}
                data-index={props.index}
                data-sceen-size={window.innerWidth}
            >
                {!props.tall ? (
                    <>
                        <div className="card-title">
                            <p
                                className='cursor-pointer text-ellipsis'
                                onClick={handleMarketplacePurchase(props.goods)}
                            >
                                {props.name}
                            </p>
                        </div>
                        <div className="card-body">
                            <div
                                onClick={handleMarketplaceImage}
                                className={classNames({
                                    "card-avatar": true,
                                    "no-image": !props.hasImage,
                                    "cursor-pointer": true
                                })}
                                style={{
                                    backgroundImage: 'url(' + config.api.serverUrl + 'requestType=downloadPrunableMessage&transaction=' + props.goods + '&retrieve=true)'
                                }}
                            />
                            <div className="price-box">
                                <div className='price-amount mb-3'>
                                    <span className="amount">{handlePrice()}</span>
                                    <span className="currency">{ticker}</span>
                                </div>
                                <div className="user mb-3">
                                    {props.description}
                                </div>
                            </div>
                            <button
                                type='button'
                                onClick={handleMarketplacePurchase(props.goods)}
                                className="btn btn-lg btn-green submit-button"
                            >
                                Purchase
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="card-title">
                            {props.completedOrders ? (
                                <p className='text-ellipsis'>
                                    {props.name}
                                </p>
                            ) : (
                                <p
                                    className='cursor-pointer text-ellipsis'
                                    onClick={handleMarketplacePurchase((props.fluid && props.purchase) ? props.purchase : props.goods)}
                                >
                                    {props.name}
                                </p>
                            )}
                        </div>
                        <div className="card-body">
                            <div className='form-group-app'>
                                <div
                                    onClick={handleMarketplaceImage}
                                    className={classNames({
                                        "card-avatar": true,
                                        "cursor-pointer": true,
                                        "no-image": !props.hasImage
                                    })}
                                    style={{
                                        backgroundImage: 'url(' + config.api.serverUrl + 'requestType=downloadPrunableMessage&transaction=' + props.goods + '&retrieve=true)'
                                    }}
                                />
                                <div className="price-box">
                                    <div className='price-amount mb-3'>
                                        <span className="amount">{handlePrice()}</span>
                                        <span className="currency">{ticker}</span>
                                    </div>
                                    {props.fluid && (
                                        <div className="mb-3">
                                            <label>Good:</label>
                                            <div
                                                className={"cursor-pointer blue-link-text"}
                                                onClick={handleMarketPlaceGoodDetails}
                                            >
                                                {props.goods}
                                            </div>
                                        </div>
                                    )}
                                    {props.description && (
                                        <div className="cargo-title-description mb-3">
                                            <label>Description:</label>
                                            <div className="user">
                                                {props.description.length < 100 ? props.description : props.description.slice(0, 100) + '...'}
                                            </div>
                                        </div>
                                    )}
                                    {props.completedOrders && (
                                        <>
                                            <div className='mb-3'>
                                                <label>Buyer:</label>
                                                <div
                                                    className="cursor-pointer blue-link-text"
                                                    onClick={handleMarketplaceAccountInfo(props.buyerRS)}
                                                >
                                                    {props.buyerRS}
                                                </div>
                                            </div>
                                            <div className='mb-3'>
                                                <label>Order date:</label>
                                                <div>
                                                    {handleTime(props.timestamp)}
                                                </div>
                                            </div>
                                            <div className='mb-3'>
                                                <label>Order status:</label>
                                                <div>
                                                    {props.pending ? "Pending" : "Completed"}
                                                </div>
                                            </div>
                                            <div className='mb-3'>
                                                <label>Quantity:</label>
                                                <div>
                                                    {props.quantity}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {props.deliver && (
                                        <>
                                            <div className='mb-3'>
                                                <label>Buyer:</label>
                                                <div
                                                    className="cursor-pointer blue-link-text"
                                                    onClick={handleMarketplaceAccountInfo}
                                                >
                                                    {props.buyerRS}
                                                </div>
                                            </div>
                                            <div className='mb-3'>
                                                <label>Order date:</label>
                                                <div>
                                                    {handleTime(props.timestamp)}
                                                </div>
                                            </div>
                                            <div className='mb-3'>
                                                <label>Delivery deadline:</label>
                                                <div>
                                                    {handleTime(props.deliveryDeadlineTimestamp)}
                                                </div>
                                            </div>
                                            <div className='mb-3'>
                                                <label>Quantity:</label>
                                                <div>
                                                    {props.quantity}
                                                </div>
                                            </div>
                                            <button
                                                type='button'
                                                onClick={handleMarketplaceGoodsDeliver}
                                                className="btn btn-lg btn-green submit-button"
                                            >
                                                Deliver Goods
                                            </button>
                                        </>
                                    )}
                                    {(!props.deliver && !props.completedOrders) && (
                                        <>
                                            {props.fluid && (
                                                <>
                                                    <div className='mb-3'>
                                                        <label>Quantity:</label>
                                                        <div>
                                                            {props.quantity}
                                                        </div>
                                                    </div>
                                                    {!!props.numberOfPurchases && (
                                                        <div className='mb-3'>
                                                            <label>Purchases:</label>
                                                            <div>
                                                                {props.numberOfPurchases}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            <div className='mb-3'>
                                                <label>Seller:</label>
                                                <div
                                                    className="cursor-pointer blue-link-text"
                                                    onClick={handleMarketplaceAccountInfo(props.sellerRS)}
                                                >
                                                    {props.sellerRS}
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <Link
                                                    to={'/marketplace/' + props.sellerRS}
                                                    className="btn btn-green btn-sm"
                                                >
                                                    Store
                                                </Link>
                                            </div>
                                            <div className='mb-3'>
                                                <label>Listing date:</label>
                                                <div>
                                                    {handleTime(props.timestamp)}
                                                </div>
                                            </div>
                                            {props.tags && (
                                                <div className='tags mb-3'>
                                                    <label>Tags:</label>
                                                    <div>
                                                        {tagsArr.map((el) => (
                                                            <Link
                                                                key={`tag-item-${el}`}
                                                                to={'/marketplace/' + el}
                                                                className="btn filter"
                                                            >
                                                                {el}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MarketplaceItem;
