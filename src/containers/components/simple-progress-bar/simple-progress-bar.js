import React from 'react';
import './style.scss';

const SimpleProgressBar = ({step, time}) => {
    const infoAboutStep = {
        0: 'The first user send a contract, wait for review and approval. (On this step user doesn`t transfer money.)',
        1: 'The second user approve the contract, transfer the money and wait for counter transfer.',
        2: 'The first user send counter transfer.',
        3: 'Cansel',
    }
    
    const currentStep = step + 1
    const maxStep = 4
    const progress = (currentStep / maxStep) * 100
    
    return (
        <div className='progress-bar-simple'>
            <div className='progress-bar-simple__header'>
                <div className='progress-bar-simple__info'>
                    Step {currentStep}
                </div>
                <div className='progress-bar-simple__info'>
                    Max waiting time for end of point: {time}
                </div>
            </div>
            <div className='progress-bar-simple__progress-bar'>
                <div className='progress-bar-simple__progress-step' style={{width: `${progress}%`}}></div>
            </div>
            <div className='progress-bar-simple__info'>
                {infoAboutStep[step]}
            </div>
        </div>
    )
}

export default SimpleProgressBar