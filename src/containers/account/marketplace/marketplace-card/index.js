import React from 'react';
import classNames from 'classnames';

const MarketplaceItem = (props) => (
    <div className={classNames({
        'card': true,
        'marketplace': true,
        'card-flexible': true,
        'market': true,
        'tall-card': props.tall
    })}>
        {
            !props.tall &&
                [
                    <div className="card-avatar" ></div>
                    ,
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
                ]

        }
        {
            props.tall &&
            [
                <div className="card-avatar" ></div>
                ,
                <div className="price-box">
                    <div className='price-amount'>
                        <div className="amount">
                            200
                        </div>
                        <div className="currency">
                            APL
                        </div>
                    </div>
                    <div className="cargo-description">
                        <div className="cargo-title">
                            LittleRocketMan
                        </div>
                        <div className="cargo-description">
                            1315373125663124546
                        </div>
                    </div>
                    <div className="cargo-owner-box">
                        <div className="cargo-owner">
                            <span>
                                APL-KUM3-5N3W-FZRJ-GSZX9
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

export default MarketplaceItem;