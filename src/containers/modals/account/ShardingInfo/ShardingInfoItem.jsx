import React from 'react';

const shardStatus = {
  0: 'INIT',
  1: 'IN PROGRESS', 
  50: 'CREATED BY ARCHIVE',
  100: 'FULL',
}

export const ShardingInfoItem = ({ shardId, coreZipHash, prunableZipHash, shardState }) => (
  <tr className='full-info' style={{cursor: 'pointer'}}>
      <td>{shardId}</td>
      <td>{shardStatus[shardState]}</td>
      <td>{coreZipHash}</td>
      <td>{prunableZipHash}</td>
  </tr>
);