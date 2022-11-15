/******************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch} from 'react-redux';
import {getShards} from '../../../../actions/sharding';
import ModalBody from "../../../components/modals/modal-body";
import { TableLoader } from 'containers/components/TableLoader';
import { ShardingInfoItem } from './ShardingInfoItem';


const ShardingInfo = ({ closeModal }) => {
    const dispatch = useDispatch();
    const dataLoader = useCallback(async () => 
        await dispatch(getShards())
    , [dispatch]);

    return (
        <ModalBody
            modalTitle='Sharding info'
            closeModal={closeModal}
            isDisableFormFooter
            isXWide
            isDisableSecretPhrase
        >
                <TableLoader
                    headersList={[
                        {
                            name: 'Shard ID',
                            alignRight: false
                        },
                        {
                            name: 'Shard State',
                            alignRight: false
                        }, {
                            name: 'Main Shard File Hash',
                            alignRight: false
                        }, {
                            name: 'Prunable Data Shard File',
                            alignRight: false
                        }
                    ]}
                    className='no-min-height transparent'
                    emptyMessage='No shards.'
                    dataLoaderCallback={dataLoader}
                    TableRowComponent={ShardingInfoItem}
                />
        </ModalBody>
    );
}

export default ShardingInfo;
