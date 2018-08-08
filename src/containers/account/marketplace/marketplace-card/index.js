import React from 'react';
import classNames from 'classnames';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

const MarketplaceItem = (props) => (
    <div className={classNames({
        'card': true,
        'marketplace': true,
        'card-flexible': true,
        'market': true,
        'full-height': props.fullHeight,
        'tall-card': props.tall,
        'card-fluid': props.fluid,
    })}>
        {
            !props.tall && !props.fluid &&
                [
                    <div
                        onClick={() => props.setBodyModalParamsAction('MARKETPLACE_IMAGE', props.goods)}
                        className="card-avatar"
                        style={{
                            backgroundImage: 'url(https://apollowallet.org/apl?requestType=downloadPrunableMessage&transaction=' + props.goods + '&retrieve=true)'
                        }}
                    />
                    ,
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
                            onClick={() => props.setBodyModalParamsAction('MARKETPLACE_GOOD_DETAILS', props.goods)}
                            className="user"
                        >
                            {props.name}
                        </div>
                    </div>
                ]

        }
        {
            props.tall &&
            [
                <div
                    onClick={() => props.setBodyModalParamsAction('MARKETPLACE_IMAGE', props.goods)}
                    className="card-avatar"
                    style={{
                        backgroundImage: 'url(https://apollowallet.org/apl?requestType=downloadPrunableMessage&transaction=' + props.goods + '&retrieve=true)'
                    }}
                />
                ,
                <div className="price-box">
                    <div className='price-amount'>
                        <div className="amount">
                            {props.priceATM / 100000000}
                        </div>
                        <div className="currency">
                            APL
                        </div>
                    </div>
                    <div className="cargo-description">
                        <div
                            onClick={() => props.setBodyModalParamsAction('MARKETPLACE_GOOD_DETAILS', props.goods)}
                            className="cargo-title"
                        >
                            {props.name}
                        </div>
                        <div className="cargo-description" dangerouslySetInnerHTML={{__html: props.description.length < 100 ? props.description : props.description.slice(0, 100) + '&hellip;'}} />
                    </div>
                    <div className="cargo-owner-box">
                        <div className="cargo-owner">
                            <span>
                                {props.sellerRS}
                            </span>

                            <a className="btn primary blue">
                                Store
                            </a>
                        </div>
                        <div className="publishing-date">
                            7/6/2018 2:45:27
                        </div>
                    </div>
                </div>
            ]
        }
        {
            props.fluid &&
            [
                <div className='left-bar'>
                    <div
                        onClick={() => props.setBodyModalParamsAction('MARKETPLACE_IMAGE', props.goods)}
                        className="card-avatar"
                        style={{
                            backgroundImage: 'url(https://apollowallet.org/apl?requestType=downloadPrunableMessage&transaction=' + props.goods + '&retrieve=true)'
                        }}
                    />
                </div>
                ,
                <div className='description'>
                    {props.description}
                </div>
                ,
                <div className="price-box">
                    <div className='price-amount'>
                        <div className="amount">
                            {props.priceATM / 100000000}
                        </div>
                        <div className="currency">
                            APL
                        </div>
                    </div>
                    <div className="cargo-description">
                        <div
                            onClick={() => props.setBodyModalParamsAction('MARKETPLACE_GOOD_DETAILS', props.goods)}
                            className="cargo-title"
                        >
                            {props.name}
                        </div>
                        <div className="cargo-description" dangerouslySetInnerHTML={{__html: props.description.length < 100 ? props.description : props.description.slice(0, 100) + '&hellip;'}} />
                    </div>
                    <div className="cargo-owner-box">
                        <div className="cargo-owner">
                            <span>
                                {props.sellerRS}
                            </span>

                            <a className="btn primary blue">
                                Store
                            </a>
                        </div>
                        <div className="publishing-date">
                            7/6/2018 2:45:27
                        </div>
                    </div>
                </div>
            ]
        }


    </div>
);

export default connect(null, mapDispatchToProps)(MarketplaceItem);