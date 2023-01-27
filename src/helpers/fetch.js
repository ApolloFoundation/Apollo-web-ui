// import fetch from 'isomorphic-fetch';
import qs from 'query-string';
import { processElGamalEncryption } from 'actions/crypto';

export const GET = 'GET';
export const POST = 'POST';
export const DELETE = 'DELETE';

export const handleFetch = async (url, method, value = null, requestOptions = {}) => {
  let queryPath = url;
  const { requestType, isJson = false, isPrahseAlreadyEncrypt = false } = requestOptions;
  const contentType = isJson ? 'application/json' : 'application/x-www-form-urlencoded;charset=UTF-8';
  const options = {
    method,
    headers: { 
      'Content-Type':  contentType,
    },
  };
  if (value !== null) {
    const data = { ...value };
    if (!isPrahseAlreadyEncrypt) {
      if (data.passphrase) {
        data.passphrase = await processElGamalEncryption(data.passphrase);
        delete data.secretPhrase;
      } else if (data.secretPhrase) {
        data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
      }
    }

    if (method === GET) {
      queryPath += `?${qs.stringify(data)}`;
    } else if (!isJson){
      options.body = Object
        .keys(data)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
    } else {
      options.body = JSON.stringify(data);
    }
  }
  return fetch(queryPath, options).then(res => res.json());
};
