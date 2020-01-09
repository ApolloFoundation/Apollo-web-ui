import { logMessage } from './helpers';
var Requester = /** @class */ (function () {
    function Requester(headers) {
        if (headers) {
            this._headers = headers;
        }
    }
    Requester.prototype.sendRequest = function (datafeedUrl, urlPath, params) {
        console.log(urlPath);
        var urldata = (urlPath === 'history' || urlPath === 'symbols') ? 'http://127.0.0.1:7876' : datafeedUrl;
        var url = (urlPath === 'history' || urlPath === 'symbols') ? '/rest/dex/' : '/';
        // const gg = urlPath === 'search' ? 'https://demo_feed.tradingview.com/'  : `${datafeedUrl}/rest/dex/`
        if (params !== undefined) {
            var paramKeys = Object.keys(params);
            if (paramKeys.length !== 0) {
                urlPath += '?';
            }
            urlPath += paramKeys.map(function (key) {
                return encodeURIComponent(key) + "=" + encodeURIComponent(params[key].toString());
            }).join('&');
        }
        logMessage('New request: ' + urlPath);
        // Send user cookies if the URL is on the same origin as the calling script.
        var options = { credentials: 'same-origin' };
        if (this._headers !== undefined) {
            options.headers = this._headers;
        }
        // console.log(urldata + url);
        return fetch("" + urldata + url + urlPath, options)
            .then(function (response) { return response.text(); })
            .then(function (responseTest) { return JSON.parse(responseTest); });
    };
    return Requester;
}());
export { Requester };
