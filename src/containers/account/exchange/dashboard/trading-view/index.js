import * as React from 'react';
import { connect } from 'react-redux';
import Datafeed from './api/'
import './index.scss';

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

class TVChartContainer extends React.PureComponent {

	static defaultProps = {
		symbol: 'Coinbase:APL/ETH',
		interval: '15',
		containerId: 'tv_chart_container',
		libraryPath: '/charting_library/',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
		currency: 'ETH',
	};

	componentDidMount() {
		this.createTVChart();
	}

	componentDidUpdate(props,state) {
		if(props.currency !== this.props.currency) {
			this.createTVChart();
		}
	}

	createTVChart = () => {
		const widgetOptions = {
			debug: false,
			symbol: `Coinbase:APL/${this.props.currency.toUpperCase()}`,
			datafeed: Datafeed,
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
				"symbolWatermarkProperties.transparency": 90,
				"scalesProperties.textColor" : "#98b0cd",
				"paneProperties.legendProperties.showSeriesTitle": false,
				"paneProperties.legendProperties.showLegend": false,
				"paneProperties.legendProperties.showBarChange": false,
				"paneProperties.legendProperties.showOnlyPriceSource": false,
				"mainSeriesProperties.candleStyle.wickUpColor": '#336854',
				"mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
			}
		};
		// window.TradingView.onready(() => {
			const widget = window.tvWidget = new window.TradingView.widget(widgetOptions);
			widget.onChartReady(() => {
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

const mapStateToProps = ({exchange}) => ({
    currency: exchange.currentCurrency.currency,
});

export default connect(mapStateToProps, null)(TVChartContainer)