import React from 'react';
import {connect} from 'react-redux';
import {CircularProgressbar} from 'react-circular-progressbar';
import classNames from 'classnames';
import 'react-circular-progressbar/dist/styles.css';
import './BlocksDownloader.scss';

const maStateToProps = state => ({
    blockchainStatus: state.account.blockchainStatus,
    actualBlock: state.account.actualBlock,
    isLocalhost: state.account.isLocalhost,
});

const BlocksDownloader = ({blockchainStatus, actualBlock, isLocalhost}) => {
    let percentage = actualBlock ? (parseInt(actualBlock) / parseInt(blockchainStatus.lastBlockchainFeederHeight) * 100) : 0;
    percentage = percentage > 100 ? 99.9 : percentage;
    return (
        <div className={'wrap-block-downloader'}>
            {blockchainStatus.status && blockchainStatus.status.tasks.map(task => (
                (task.stateOfTask !== "Finished" && task.isCrititcal) ? (
                    <div key={task.id} className={'block-downloader'}>
                        <CircularProgressbar
                            className={classNames({
                                'Downloader': true,
                            })}
                            percentage={task.percentComplete}
                            text={`${task.percentComplete.toFixed(2)}%`}
                            styles={{
                                path: {
                                    stroke: '#2547F4',
                                    strokeLinecap: 'butt',
                                },
                                trail: {
                                    stroke: '#E6EAEE',
                                },
                                text: {fill: '#F36', fontSize: '16px'},
                            }}
                            strokeWidth={12}
                        />
                        <div className="block-downloader_text">
                            {task.name}
                        </div>
                    </div>
                ) : null
            ))}
            {isLocalhost && actualBlock && blockchainStatus.isDownloading ? (
                <div className={'block-downloader'}>
                    <CircularProgressbar
                        className={classNames({
                            'Downloader': true,
                        })}
                        percentage={percentage}
                        text={`${percentage.toFixed(2)}%`}
                        styles={{
                            path: {
                                stroke: '#2547F4',
                                strokeLinecap: 'butt',
                            },
                            trail: {
                                stroke: '#E6EAEE',
                            },
                            text: {fill: '#F36', fontSize: '16px'},
                        }}
                        strokeWidth={12}
                    />
                    <div className="block-downloader_text">
                        Downloading blocks
                    </div>
                </div>
            ) : null}
        </div>
    )
};


export default connect(maStateToProps, null)(BlocksDownloader)
