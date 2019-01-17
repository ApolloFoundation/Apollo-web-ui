import React from 'react';
import {connect} from 'react-redux';
import CircleFigure from '../../account/dashboard/circle-figure'
import './BlocksDownloader.scss'
import CircularProgressbar from 'react-circular-progressbar';
import classNames from "classnames";

import {loadBlockchainStatus} from '../../../actions/login';



class  BlocksDownloader extends React.Component {

    interval = setInterval(() => {
        this.props.loadBlockchainStatus()
    }, 10000)

    render () {
        const {blockchainStatus, actualBlock} = this.props;

        console.log(blockchainStatus)
        console.log(actualBlock)

        if (blockchainStatus && actualBlock) {
            const percentage = Math.round((parseInt(actualBlock) / parseInt(blockchainStatus.currentMinRollbackHeight)) * 100);
            console.log(percentage)
    
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
}

const mapDispatchToProps = dispatch => ({
    loadBlockchainStatus : () => dispatch(loadBlockchainStatus())
})

const maStateToProps = state => ({
    blockchainStatus: state.account.blockchainStatus,
    actualBlock: state.account.actualBlock
})

export default connect(maStateToProps, mapDispatchToProps)(BlocksDownloader)