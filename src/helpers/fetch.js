import fetch from 'isomorphic-fetch';
import qs from "query-string";
import {processElGamalEncryption} from "../actions/crypto";

export const GET = 'GET';
export const POST = 'POST';
export const DELETE = 'DELETE';

export const handleFetch = async (url, method, value = null, typeOfRequest) => {
    let queryPath = url;
    const options =  {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
    };
    if (value !== null) {
        if (value.passphrase) {
            value.passphrase = await processElGamalEncryption(value.passphrase, typeOfRequest);
            delete value.secretPhrase;
        } else if (value.secretPhrase) {
            value.secretPhrase = await processElGamalEncryption(value.secretPhrase, typeOfRequest);
        }

        if (method === GET) {
            queryPath += `?${qs.stringify(value)}`;
        } else {
            options.body = Object.keys(value).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(value[key]);
            }).join('&');
        }
    }
    return fetch(queryPath, options).then((res) => res.json());
};
