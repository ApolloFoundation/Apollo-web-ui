import React, {Component} from 'react';
import classNames from 'classnames';
import {getNewsAction} from "../../../../actions/account";
import {connect} from 'react-redux';

class DashboardNews extends Component {
    state = {
        newsItem: 0
    };

    componentDidMount = () => {
        this.getNews();
    }

    getNews = async () => {
        const news = await this.props.getNewsAction();
        if (news) {
            this.setState({
                news,
                newsCount: news.tweets.length
            })
        }
    };

    getNewsItem = (tweet) => {
        let itemContent = '';
        const post = tweet.retweeted_status ? tweet.retweeted_status : tweet;
        const dateArr = post.created_at.split(" ");
        const media = (post.extended_entities && post.extended_entities.media.length > 0) ?
            post.extended_entities.media[0].media_url : false;
        itemContent += `<div class='post-title'>@${post.user.screen_name}<span class='post-date'>${dateArr[1]} ${dateArr[2]}</span></div>`;
        itemContent += `<div class='post-content'>${post.full_text}</div>`;
        if (media) itemContent += `<div class='post-image' style="background-image: url('${media}')"></div>`;
        return <a className="post-item" href={`https://twitter.com/${post.user.screen_name}/status/${post.id_str}`}
                  target="_blank" dangerouslySetInnerHTML={{__html: itemContent}} rel="noopener noreferrer"/>;
    };

    render () {
        return (
            <div className="card card-tall justify-content-start apollo-news">
                <div className="card-title">Apollo News</div>
                <div className="card-body d-flex flex-column justify-content-between">
                    <div className="card-news-content">
                        {this.state.news && this.getNewsItem(this.state.news.tweets[this.state.newsItem])}
                    </div>
                </div>

                {this.state.news && (
                    <div className="btn-box pagination mt-3">
                        <button
                            className={classNames({
                                'btn': true,
                                'btn-left': true,
                                'btn-default': true,
                                'absolute': true,
                                'disabled': this.state.newsItem === 0
                            })}
                            data-modal="sendMoney"
                            onClick={() => {
                                this.setState({newsItem: this.state.newsItem - 1})
                            }}
                        >
                            <i className="arrow zmdi zmdi-chevron-left"/>&nbsp;
                            Previous
                        </button>
                        {
                            this.state.newsCount &&
                            <button
                                className={classNames({
                                    'btn': true,
                                    'btn-right': true,
                                    'btn-default': true,
                                    'absolute': true,
                                    'disabled': this.state.newsItem === this.state.newsCount - 1
                                })}
                                data-modal="sendMoney"
                                onClick={() => {
                                    this.setState({newsItem: this.state.newsItem + 1})
                                }}
                            >
                                Next&nbsp;
                                <i className="arrow zmdi zmdi-chevron-right"/>
                            </button>
                        }
                    </div>
                )}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    getNewsAction: () => dispatch(getNewsAction()),
});

export default connect(null, mapDispatchToProps)(DashboardNews);