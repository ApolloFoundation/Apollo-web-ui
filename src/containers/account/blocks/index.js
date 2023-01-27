/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useState } from 'react';
import SiteHeader from 'containers/components/site-header'
import TabContaier from "containers/components/tabulator/tab-container";
import TabulationBody from "containers/components/tabulator/tabuator-body";
import { ForgedBlocks } from './ForgedBlocks';
import { AllBlocks } from './AllBlocks';
import { BlocksForm } from './form'
import './Blocks.scss';

const Blocks = () => {
    const [state, setState] =useState({
        isForged:false,
        height: null,
    })

	const handleChangeTab = (e, index) => {
		setState(prevState => ({
            ...prevState,
            isForged: Boolean(index),
        }))
	};

    const handleFormSubmit = ({ height }) => {
        setState(prevState => ({
            ...prevState,
            height,
        }))
    }

    return (
        <div className="page-content">
            <SiteHeader pageTitle='Blocks' />
            <div className="page-body container-fluid mb-3">
                <div className="transactions-filters">
                    <BlocksForm onSubmit={handleFormSubmit} />
                </div>
                <div className="form-group-app transparent">
                    <TabulationBody className='p-0' onChange={handleChangeTab}>
                        <TabContaier sectionName='Blocks'>
                            <AllBlocks height={state.height} />
                        </TabContaier>
                        <TabContaier sectionName='Forged by You'>
                            <ForgedBlocks />
                        </TabContaier>
                    </TabulationBody>
                </div>
            </div>
        </div>
    );
}

export default Blocks;
