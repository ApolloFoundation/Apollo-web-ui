import React from 'react';
import { ReactComponent as TwitterImg } from '../../../../assets/social-icons/twitter.svg';
import { ReactComponent as MediumImg } from '../../../../assets/social-icons/medium.svg';
import { ReactComponent as GithubImg } from '../../../../assets/social-icons/github.svg';
import { ReactComponent as InstagramImg } from '../../../../assets/social-icons/instagram.svg';
import { ReactComponent as FacebookImg } from '../../../../assets/social-icons/facebook.svg';
import { ReactComponent as TelegramImg } from '../../../../assets/social-icons/telegram.svg';
import { ReactComponent as ArrowRight } from '../../../../assets/arrow-right.svg';

const StayInTouch = () => (
  <div className="card card-light card-h-255">
    <div className="card-title">
      <div className="title">Stay In Touch</div>
    </div>
    <div className="card-body">
      <div className="social-wrap">
        <div className="social-row">
          <a
            className="social-item"
            href="https://twitter.com/aplfintech"
            target="_blank"
            rel="noopener noreferrer"
            data-custom
            data-custom-at="top"
            data-cat-id={JSON.stringify({
              infoContent: 'Check out',
              infoTitle: 'Our Twitter',
            })}
          >
            <TwitterImg />
          </a>
          <a
            className="social-item"
            href="https://medium.com/@apollocurrency"
            target="_blank"
            rel="noopener noreferrer"
            data-custom
            data-custom-at="top"
            data-cat-id={JSON.stringify({
              infoContent: 'Check out',
              infoTitle: 'Our Medium',
            })}
          >
            <MediumImg />
          </a>
          <a
            className="social-item"
            href="https://github.com/ApolloFoundation/Apollo"
            target="_blank"
            rel="noopener noreferrer"
            data-custom
            data-custom-at="top"
            data-cat-id={JSON.stringify({
              infoContent: 'Check out',
              infoTitle: 'Our Github',
            })}
          >
            <GithubImg />
          </a>
        </div>
        <div className="social-row">
          <a
            className="social-item"
            href="https://www.instagram.com/apollocurrency"
            target="_blank"
            rel="noopener noreferrer"
            data-custom
            data-custom-at="top"
            data-cat-id={JSON.stringify({
              infoContent: 'Check out',
              infoTitle: 'Our Instagram',
            })}
          >
            <InstagramImg />
          </a>
          <a
            className="social-item"
            href="https://www.facebook.com/Apolloprivacycoin"
            target="_blank"
            rel="noopener noreferrer"
            data-custom
            data-custom-at="top"
            data-cat-id={JSON.stringify({
              infoContent: 'Check out',
              infoTitle: 'Our Facebook',
            })}
          >
            <FacebookImg />
          </a>
          <a
            className="social-item"
            href="http://t.me/apollocommunity"
            target="_blank"
            rel="noopener noreferrer"
            data-custom
            data-custom-at="top"
            data-cat-id={JSON.stringify({
              infoContent: 'Check out',
              infoTitle: 'Our Telegram',
            })}
          >
            <TelegramImg />
          </a>
        </div>
      </div>
      <a
        href="https://apollocurrency.com/en/stay-tuned"
        className="btn btn-grey btn-lg"
        target="_blank"
      >
        <span>Contact us</span>
        <div className="btn-arrow">
          <ArrowRight />
        </div>
      </a>
    </div>
  </div>
);

export default StayInTouch;
