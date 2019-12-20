import config from '../../../../../../config'
import {handleFetch, GET, POST} from "../../../../../../helpers/fetch";

var rp = require('request-promise').defaults({json: true})

const api_root = config.api.server
const history = {}

export default {
	history: history,
    getBars: function(symbolInfo, resolution, from, to, first, limit) {
		var split_symbol = symbolInfo.name.split(/[:/]/)
			const url = resolution === 'D' || resolution === '1D' ? '/rest/dex/histoday' : resolution >= 60 ? '/rest/dex/histohour' : '/rest/dex/histominute'
			const qs = {
					e: split_symbol[0],
					fsym: split_symbol[1],
					tsym: split_symbol[2],
					toTs:  to ? to : '',
					limit: limit ? limit : 2000, 
					// aggregate: 1//resolution 
				}
		return handleFetch(`${api_root}${url}`, GET, qs)
				// .then((res) => {
				// 	if (!res.errorCode) {
				// 		return res;
				// 	} else {
				// 		NotificationManager.error(res.errorDescription, 'Error', 5000);
				// 	}
				// })
				// .catch(() => {
	
				// })
        // return rp({
        //         url: `${api_root}${url}`,
        //         qs,
        //     })
            .then(data => {
                console.log({data})
				if (data.Response && data.Response === 'Error') {
					console.log('CryptoCompare API error:',data.Message)
					return []
				}
				if (data.Data.length) {
					console.log(`Actually returned: ${new Date(data.TimeFrom * 1000).toISOString()} - ${new Date(data.TimeTo * 1000).toISOString()}`)
					var bars = data.Data.map(el => {
						return {
							time: el.time * 1000, //TradingView requires bar time in ms
							low: el.low,
							high: el.high,
							open: el.open,
							close: el.close,
							volume: el.volumefrom,
						}
					})
						if (first) {
							var lastBar = bars[bars.length - 1]
							history[symbolInfo.name] = {lastBar: lastBar}
						}
					return bars
				} else {
					return []
				}
			})
}
}
