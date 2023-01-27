import React from 'react';
import normalizeDeadline from 'helpers/normalizeTime';
import './style.scss';

const SimpleProgressBar = ({contractOrder: {deadlineToReply, contractStatus}, blockTime, status}) => {

    const infoAboutStep = {
        0: 'The first user send a contract, wait for review and approval. (On this step user doesn`t transfer money.)',
        1: 'The second user approve the contract, transfer the money and wait for counter transfer.',
        2: 'The first user send counter transfer.',
        3: 'Cancel',
    }

    const listClosedStatuses = {
        'Closed': 'Contract was Closed',
        'Expired': 'Contract was Expired',
        'Accounting': 'Waiting expiration of atomic swap',
    }

    const timeLeft = (deadlineToReply - blockTime) / 60 / 60
    const maxStep = 4
    const isClosedStatus = Object.keys(listClosedStatuses).includes(status)

    const currentStep = (isClosedStatus || timeLeft <= 0) ? maxStep : contractStatus + 1
    const progress = (currentStep / maxStep) * 100

    return (
        <div className='progress-bar-simple'>
            <div className='progress-bar-simple__header'>
                <div className='progress-bar-simple__info'>
                    Step {currentStep}
                </div>
                {(currentStep !== 4 || !isClosedStatus) && (
                    deadlineToReply && blockTime
                    ?   <div className='progress-bar-simple__info'>
                            Max waiting time for end of point: {normalizeDeadline(deadlineToReply, blockTime)}
                        </div>
                    :   <div className={'align-items-center loader-box'}>
                            <div className="ball-pulse">
                                <div/>
                                <div/>
                                <div/>
                            </div>
                        </div>
                    )}
            </div>
            <div className='progress-bar-simple__progress-bar'>
                <div className='progress-bar-simple__progress-step' style={{width: `${progress}%`}}></div>
            </div>
            <div className='progress-bar-simple__info'>
                {isClosedStatus ? listClosedStatuses[status] : infoAboutStep[contractStatus]}
            </div>
        </div>
    )
}

export default SimpleProgressBar