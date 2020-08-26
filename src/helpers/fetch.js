import fetch from 'isomorphic-fetch';
import qs from 'query-string';
import { processElGamalEncryption } from '../actions/crypto';

export const GET = 'GET';
export const POST = 'POST';
export const DELETE = 'DELETE';

export const handleFetch = async (url, method, value = null, typeOfRequest) => {
  let queryPath = url;
  const options = {
    method,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  };
  if (value !== null) {
    const data = { ...value };
    if (data.passphrase) {
      data.passphrase = await processElGamalEncryption(data.passphrase, typeOfRequest);
      delete data.secretPhrase;
    } else if (data.secretPhrase) {
      data.secretPhrase = await processElGamalEncryption(data.secretPhrase, typeOfRequest);
    }

    if (method === GET) {
      queryPath += `?${qs.stringify(data)}`;
    } else {
      options.body = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
    }
  }
  return fetch(queryPath, options).then(res => res.json());
};
