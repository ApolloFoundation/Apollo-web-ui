import * as React from 'react';
import './index.css';
import Datafeed from './api/'
import ExchangeSwitch from '../plot/ExchangeSwitch'


function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export default class TVChartContainer extends React.PureComponent {

	static defaultProps = {
		symbol: 'Coinbase:BTC/USD',
		interval: '15',
		containerId: 'tv_chart_container',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
	};

	componentDidMount() {
		console.log(Datafeed, '1');
		
		const widgetOptions = {
			debug: false,
			symbol: this.props.symbol,
			datafeed: Datafeed,
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			locale: getLanguageFromURL() || 'en',
			disabled_features: ['use_localstorage_for_settings'],
			enabled_features: ['study_templates'],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
			overrides: {
				// "mainSeriesProperties.showCountdown": true,
				"paneProperties.background": "#fff",
				"paneProperties.vertGridProperties.color": "#363c4e",
				"paneProperties.horzGridProperties.color": "#363c4e",
				"symbolWatermarkProperties.transparency": 90,
				"scalesProperties.textColor" : "#AAA",
				"mainSeriesProperties.candleStyle.wickUpColor": '#336854',
				"mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
			}
		};
		console.log(widgetOptions, '2');
		
		// window.TradingView.onready(() => {
			const widget = window.tvWidget = new window.TradingView.widget(widgetOptions);

			widget.onChartReady(() => {
				console.log('Chart has loaded!')
			});
		// });
	}

	render() {
        const {currentCurrency: {currency}, currencies, switchCurrency, wallet, handleLoginModal} = this.props;

		return (
			<div>
				<ExchangeSwitch
					currency={currency}
					currencies={currencies}
					switchCurrency={switchCurrency}
					wallet={wallet}
					handleLoginModal={handleLoginModal}
				/>
				<div
					id={ this.props.containerId }
					className={ 'TVChartContainer' }
				/>
			</div>
		);
	}
}
