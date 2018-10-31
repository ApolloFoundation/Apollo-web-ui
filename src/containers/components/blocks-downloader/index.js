import React from 'react';
import {connect} from 'react-redux';
import CircleFigure from '../../account/dashboard/circle-figure'
import './BlocksDownloader.css'
import CircularProgressbar from 'react-circular-progressbar';
import classNames from "classnames";

const maStateToProps = state => ({
    blockchainStatus: state.account.blockchainStatus,
    actualBlock: state.account.actualBlock
})

const  BlocksDownloader = (props) => {

    if (props.blockchainStatus && props.actualBlock) {
        const percentage = Math.round((parseInt(props.actualBlock) / parseInt(props.blockchainStatus.lastBlockchainFeederHeight)) * 100);

        return (
            <div
                className={'block-downloader'}
            >
                {
                    <React.Fragment>

                        <CircularProgressbar
                            className={classNames({
                                'Downloader': true,
                            })}
                            percentage={percentage}
                            text={`${percentage}%`}
                            styles={{
                                path: { stroke: `rgba(62, 152, 199, ${percentage / 100})` },
                                text: { fill: '#f88', fontSize: '16px' },
                            }}
                            style={{
                                margin: 0,
                                height: 70
                            }}
                            strokeWidth={14}
                        />
                        <div className="block-downloader_text">
                            Downloading blocks
                        </div>
                    </React.Fragment>
                }
            </div>
        )
    } else {
        return (
            <div
                className={'block-downloader'}
            ></div>
        )
    }
}


export default connect(maStateToProps, null)(BlocksDownloader)