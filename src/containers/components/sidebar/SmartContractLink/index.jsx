import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getChainIdSelector } from 'selectors';
import { ExternalLink } from '../ExternalLink';
import smcAddress from 'smc.json';

export const SmartContractLink = ({ data }) => {
  const [link, setLink] = useState('#');
  const chainId = useSelector(getChainIdSelector);

  useEffect(() => {
    // get smart contart url from json file
    if (chainId) {
      const chainIdValue = chainId.split('-');
      setLink(smcAddress[chainIdValue[0]]);
    }
  }, [chainId]);

  return <ExternalLink  {...data} to={link} />
}