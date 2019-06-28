import React from 'react';
import TwitterImg from '../../../../../assets/social-icons/twitter.svg';
import MediumImg from '../../../../../assets/social-icons/medium.svg';
import FacebookImg from '../../../../../assets/social-icons/facebook.svg';
import GithubImg from '../../../../../assets/social-icons/github.svg';
import InstagramImg from '../../../../../assets/social-icons/instagram.svg';
import TelegramImg from '../../../../../assets/social-icons/telegram.svg';

const TalkToUs = () => (
    <div className="card talk-to-us">
        <div className="card-title">Talk To Us</div>
        <div className="card-body">
            <div className={'social-wrap'}>
                <div className={'social-row'}>
                    <a
                        className={'social-item'}
                        href="https://twitter.com/ApolloCurrency"
                        target="_blank"
                        rel="noopener noreferrer">
                        <img src={TwitterImg} alt={''}/>
                    </a>
                    <a
                        className={'social-item'}
                        href="https://medium.com/@apollocurrency"
                        target="_blank"
                        rel="noopener noreferrer">
                        <img src={MediumImg} alt={''}/>
                    </a>
                    <a
                        className={'social-item'}
                        href="https://github.com/ApolloFoundation/Apollo"
                        target="_blank"
                        rel="noopener noreferrer">
                        <img src={GithubImg} alt={''}/>
                    </a>
                </div>
                <div className={'social-row'}>
                    <a
                        className={'social-item'}
                        href="https://www.instagram.com/apollocurrency"
                        target="_blank"
                        rel="noopener noreferrer">
                        <img src={InstagramImg} alt={''}/>
                    </a>
                    <a
                        className={'social-item'}
                        href="https://www.facebook.com/Apolloprivacycoin"
                        target="_blank"
                        rel="noopener noreferrer">
                        <img src={FacebookImg} alt={''}/>
                    </a>
                    <a
                        className={'social-item'}
                        href="http://t.me/apollocommunity"
                        target="_blank"
                        rel="noopener noreferrer">
                        <img src={TelegramImg} alt={''}/>
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default TalkToUs;