import fetch from 'isomorphic-fetch';
import qs from "query-string";

export const GET = 'GET';
export const POST = 'POST';
export const DELETE = 'DELETE';

export const handleFetch = (url, method, value = null) => {
    let queryPath = url;
    const options =  {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
    };
    if (value !== null) {
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
