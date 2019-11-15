import * as React from 'react';
import './index.scss';
import Datafeed from './api/'

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export default class TVChartContainer extends React.PureComponent {

	static defaultProps = {
		symbol: 'Coinbase:APL/ETH',
		interval: '15',
		containerId: 'tv_chart_container',
		libraryPath: '/charting_library/',
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
			// toolbar_bg: '#fff',
			locale: getLanguageFromURL() || 'en',
			disabled_features: ['scales_context_menu', 'context_menus', 'volume_force_overlay', 'use_localstorage_for_settings', 'timeframes_toolbar', 'scales_context_menu', 'header_chart_type', 'header_symbol_search', 'header_compare', 'header_undo_redo', 'header_saveload', 'header_screenshot'],
			enabled_features: ['hide_left_toolbar_by_default', 'hide_last_na_study_output'],
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
			overrides: {
				// "mainSeriesProperties.showCountdown": true,
				"paneProperties.background": "#fff",
				"paneProperties.vertGridProperties.color": "#98b0cd",
				"paneProperties.horzGridProperties.color": "#98b0cd",
				"mainSeriesProperties.hiloStyle.borderColor": "#98b0cd",
				"symbolWatermarkProperties.transparency": 90,
				"mainSeriesProperties.hiloStyle.showLabels": false,
				"scalesProperties.textColor" : "#98b0cd",
				"paneProperties.legendProperties.showSeriesTitle": false,
				"paneProperties.legendProperties.showLegend": false,
				"paneProperties.legendProperties.showBarChange": false,
				"paneProperties.legendProperties.showOnlyPriceSource": false,
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

		return (
			<div
				id={ this.props.containerId }
				className={ 'TVChartContainer' }
			/>
		);
	}
}
