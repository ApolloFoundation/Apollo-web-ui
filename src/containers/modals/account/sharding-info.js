/******************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {getShards} from '../../../actions/sharding';
import CustomTable from '../../components/tables/table';
import ModalBody from "../../components/modals/modal-body";

class ShardingInfo extends React.Component {

    state = {
        shards: [],
    }

    componentDidMount() {
        this.getAllShards();
    }
    
    getAllShards = async () => {
        const shards = await this.props.getShards();
        this.setState({shards});
    }

    render() {
        const shardStatus = {
            0: 'INIT',
            1: 'IN PROGRESS', 
            50: 'CREATED BY ARCHIVE',
            100: 'FULL',
        }

        return (
            <ModalBody
                modalTitle={'Sharding info'}
                closeModal={this.props.closeModal}
                isDisableFormFooter
                isXWide
                isDisableSecretPhrase
            >
                {this.state.shards ?
                    <CustomTable
                        header={[
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
                        className={'no-min-height transparent'}
                        emptyMessage={'No shards.'}
                        tableData={this.state.shards}
                        TableRowComponent={(props) => {
                            return (
                                <tr className={'full-info'} style={{cursor: 'pointer'}}>
                                    <td>{props.shardId}</td>
                                    <td>{shardStatus[props.shardState]}</td>
                                    <td>{props.coreZipHash}</td>
                                    <td>{props.prunableZipHash}</td>
                                </tr>
                            )
                        }}
                    />
                : <div className={'align-items-center loader-box'}>
                    <div className="ball-pulse">
                        <div/>
                        <div/>
                        <div/>
                    </div>
                </div>}
            </ModalBody>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    getShards: (data) => dispatch(getShards(data)),
});

export default connect(null, mapDispatchToProps)(ShardingInfo);
