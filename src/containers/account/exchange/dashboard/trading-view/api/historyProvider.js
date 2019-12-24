import config from '../../../../../../config'
import {handleFetch, GET} from "../../../../../../helpers/fetch";

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
            .then(data => {
				if (data.Response && data.Response === 'Error') {
					return []
				}
				if (data.Data.length) {
					var bars = data.Data.map(el => {
						return {
							time: el.time * 1000,
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
