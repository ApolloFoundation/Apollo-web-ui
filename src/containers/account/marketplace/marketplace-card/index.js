/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import classNames from 'classnames';
import {Link} from 'react-router-dom'
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import {formatTimestamp} from "../../../../helpers/util/time";
import uuid from 'uuid';
import config from '../../../../config';

const mapDispatchToProps = dispatch => ({
	setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
	formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});

const MarketplaceItem = (props, history) => (
	<div
		className={classNames({
			'card': true,
			'marketplace': true,
			'market': true,
			'hovered': props.isHovered,
			'relative': props.relative,
			'full-height': props.fullHeight,
			'tall-card': props.tall,
			'card-fluid': props.fluid,
			"is-last-row": (props.index >= 4 && window.innerWidth > 1000) || (props.index > 2 && window.innerWidth > 720 && window.innerWidth < 1000)
		})}
		key={uuid()}
		data-index={props.index}
		data-sceen-size={window.innerWidth}
	>
		{
			!props.tall && !props.fluid &&

			<React.Fragment>
                <div
                    onClick={() => props.setBodyModalParamsAction('MARKETPLACE_IMAGE', props.goods)}
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
                    <div className='price-amount'>
                        <div className="amount">
                            {props.priceATM / 100000000}
                        </div>
                        <div className="currency">
                            APL
                        </div>
                    </div>
                    <div
                        onClick={() => props.setBodyModalParamsAction('MARKETPLACE_PURCHASE', props.goods)}
                        className="user cursor-pointer"
                    >
                        {props.name}
                    </div>
                </div>
                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                    <a
                        onClick={() => props.setBodyModalParamsAction('MARKETPLACE_PURCHASE', props.goods)}
                        className="btn btn-right blue round round-bottom-right round-top-left"
                    >
                        Purchase
                    </a>

                </div>
			</React.Fragment>

		}
		{
			props.tall &&
            <React.Fragment>
                <div
                    onClick={() => props.setBodyModalParamsAction('MARKETPLACE_IMAGE', props.goods)}
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
                    <div className='price-amount'>
                        <div className="amount">
                            {props.priceATM / 100000000}
                        </div>
                        <div className="currency">
                            APL
                        </div>
                    </div>
                    <div className="cargo-title-description">
                        <a
                            onClick={() => props.setBodyModalParamsAction('MARKETPLACE_PURCHASE', props.goods)}
                            className="cargo-title cursor-pointer"
                        >
                            {props.name}
                        </a>
                        <div className="cargo-description"
                             dangerouslySetInnerHTML={{__html: props.description.length < 100 ? props.description : props.description.slice(0, 100) + '&hellip;'}}/>
                    </div>
                    <div className="cargo-owner-box">
                        <div className="cargo-owner">
                            <span
								className={"cursor-pointer"}
                                data-blue-link-text
                                onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.sellerRS)}
                            >
                                {props.sellerRS}
                            </span>
                            <Link to={'/marketplace/' + props.sellerRS}
                                  className="btn primary blue"
                            >
                                Store
                            </Link>
                        </div>
                        <div className="publishing-date">
                            {props.formatTimestamp(props.timestamp)}
                        </div>
                    </div>
					{
                        props.parsedTags &&
                        <div
                            className={classNames({
                                'tags': true,
                            })}
                        >
                            tags: {props.parsedTags.map((el, index) => {
                            return <Link key={uuid()} to={'/marketplace/' + el} style={{marginLeft: 15}}
                                         className="btn static primary">{el}</Link>
                        })}
                        </div>
                    }
                </div>
			</React.Fragment>
		}
		{
			props.fluid &&
			<React.Fragment>
				<div
					onClick={() => props.setBodyModalParamsAction('MARKETPLACE_IMAGE', props.goods)}
					className={classNames({
						"card-avatar": true,
						"cursor-pointer": true,
						"no-image": !props.hasImage
					})}
					style={{
						backgroundImage: 'url(' + config.api.serverUrl + 'requestType=downloadPrunableMessage&transaction=' + props.goods + '&retrieve=true)'
					}}
				/>
				<div className='right-bar'>
					<div className="item cargo-major-details">
						<div className="group">
							{
								props.purchase &&
                                <a
                                    onClick={() => props.setBodyModalParamsAction('MARKETPLACE_PURCHASE', props.purchase)}
                                    className="cargo-title cursor-pointer"
                                >
                                    {props.name}
                                </a>
								||
                                <a
                                    onClick={() => props.setBodyModalParamsAction('MARKETPLACE_PURCHASE', props.goods)}
                                    className="cargo-title cursor-pointer"
                                >
                                    {props.name}
                                </a>
                            }

							<a
								onClick={() => props.setBodyModalParamsAction('MARKETPLACE_GOOD_DETAILS', props.goods)}
								className="cargo-id cursor-pointer"
							>
								{props.goods}
							</a>
						</div>
						<div className="group">
							<div className="amount">
								{props.priceATM / 100000000}
								<small>APL</small>
							</div>
							<div className="cargo-id">
								<span>Quantity: {props.quantity}</span>
								{
									!!props.numberOfPurchases &&
                                    <span className={'blue-text'}>Purchases: {props.numberOfPurchases}</span>
								}
							</div>
						</div>
					</div>
					<div className="item description">
						<div className="text">
							{props.description}
						</div>
					</div>
					<div className="item tags-links">
						<div className="top">
							<div className="seller">
								<div className="name">Seller:</div>
								<div className="link-date">
									<div className="link cursor-pointer"
										 onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.sellerRS)}>
										{props.sellerRS}
									</div>
									<div className="date">Listing
										Date: {props.formatTimestamp(props.timestamp)}</div>
								</div>
								<Link to={'/marketplace/' + props.sellerRS}
									  className="btn primary blue"
								>
									Store
								</Link>
							</div>
						</div>
						<div className="bottom">
							{
                                props.parsedTags &&
                                <div className="seller">
                                    <div className="name">Tags:</div>
                                    <div className="tags">
                                        {
                                            props.parsedTags &&
                                            props.parsedTags.map((el, index) => {
                                                return <Link key={uuid()} to={'/marketplace/' + el} style={{marginLeft: 15}}
                                                             className="btn static primary">{el}</Link>
                                            })}
                                    </div>
                                </div>
							}
						</div>
                        {
                            props.deliver &&
                            <div className="deliver" style={{paddingTop: 35}}>
                                <a
                                    onClick={() => props.setBodyModalParamsAction('MARKETPLACE_GOODS_DELIVER', props.purchase)}
                                    className="btn blue static cursor-pointer"
								>
									Deliver Goods
								</a>
                            </div>
                        }
					</div>
				</div>
			</React.Fragment>
		}


	</div>
);

export default connect(null, mapDispatchToProps)(MarketplaceItem);