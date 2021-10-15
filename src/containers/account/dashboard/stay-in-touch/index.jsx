import React from "react";
import { v4 as uuidv4 } from "uuid";
import { ReactComponent as TwitterImg } from "../../../../assets/social-icons/twitter.svg";
import { ReactComponent as MediumImg } from "../../../../assets/social-icons/medium.svg";
import { ReactComponent as GithubImg } from "../../../../assets/social-icons/github.svg";
import { ReactComponent as InstagramImg } from "../../../../assets/social-icons/instagram.svg";
import { ReactComponent as FacebookImg } from "../../../../assets/social-icons/facebook.svg";
import { ReactComponent as TelegramImg } from "../../../../assets/social-icons/telegram.svg";
import { ReactComponent as ArrowRight } from "../../../../assets/arrow-right.svg";

const SOCIAL_DATA = [
  {
    path: "https://twitter.com/ApolloCurrency",
    infoContent: "Check out",
    infoTitle: "Our Twitter",
    icon: <TwitterImg />,
  },
  {
    path: "https://medium.com/@apollocurrency",
    infoContent: "Check out",
    infoTitle: "Our Medium",
    icon: <MediumImg />,
  },
  {
    path: "https://github.com/ApolloFoundation/Apollo",
    infoContent: "Check out",
    infoTitle: "Our Github",
    icon: <GithubImg />,
  },
  {
    path: "https://www.instagram.com/apollocurrency",
    infoContent: "Check out",
    infoTitle: "Our Instagram",
    icon: <InstagramImg />,
  },
  {
    path: "https://www.facebook.com/Apolloprivacycoin",
    infoContent: "Check out",
    infoTitle: "Our Facebook",
    icon: <FacebookImg />,
  },
  {
    path: "http://t.me/apollocommunity",
    infoContent: "Check out",
    infoTitle: "Our Telegram",
    icon: <TelegramImg />,
  },
];

const StayInTouch = () => (
  <div className="card card-light card-h-255">
    <div className="card-title">
      <div className="title">Stay In Touch</div>
    </div>
    <div className="card-body">
      <div className="social-wrap">
        <div className="row h-100">
          {SOCIAL_DATA.map((item) => (
            <div key={item.path} className="social-item col-4 text-center">
              <a
                className="social-item"
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                data-custom
                data-custom-at="top"
                data-cat-id={JSON.stringify({
                  infoContent: item.infoContent,
                  infoTitle: item.infoTitle,
                })}
              >
                {item.icon}
              </a>
            </div>
          ))}
        </div>
      </div>
      <a
        href="https://apollocurrency.com/en/stay-tuned"
        className="btn btn-grey btn-lg"
        target="_blank"
        rel="noopener noreferrer"
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
