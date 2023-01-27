import * as React from 'react';
import { connect } from 'react-redux';
import { getExchangeCurrencySelector, getTickerSelector } from 'selectors';
import config from 'config';
import './index.scss';

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

class TradingView extends React.PureComponent {
	static defaultProps = {
		interval: 'D',
		containerId: 'trading_view',
		datafeedUrl: config.api.server,
		libraryPath: `${process.env.PUBLIC_URL}/tradingview/charting_library/`,
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
		currency: 'eth',
	};

	tvWidget = null;

	componentDidMount() {
		this.createTVChart();
	};

	componentDidUpdate(props,state) {
		if(props.currency !== this.props.currency) {
			this.createTVChart();
		}
	}

	componentWillUnmount() {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	};

	createTVChart = () => {
    const {
      datafeedUrl, interval, libraryPath, containerId, fullscreen,
      studiesOverrides, autosize, currency, ticker,
    } = this.props;
		const widgetOptions = {
			symbol: `${ticker}_${currency.toUpperCase()}`,
			datafeed: new window.Datafeeds.UDFCompatibleDatafeed(datafeedUrl),
			interval: interval,
			container_id: containerId,
			library_path: libraryPath,
			locale: getLanguageFromURL() || 'en',
			disabled_features: [
				'use_localstorage_for_settings',
				'volume_force_overlay',
				'timeframes_toolbar',
				'header_chart_type',
				'header_symbol_search',
				'header_compare',
				'header_undo_redo',
				'header_saveload',
				'header_screenshot',
				'display_market_status',
			],
			enabled_features: ['hide_left_toolbar_by_default', 'hide_last_na_study_output'],
			fullscreen: fullscreen,
			autosize: autosize,
			studies_overrides: studiesOverrides,
			overrides: {
				"scalesProperties.textColor" : "#98b0cd",
				"paneProperties.legendProperties.showSeriesTitle": false,
				"paneProperties.legendProperties.showLegend": true,
				"paneProperties.legendProperties.showBarChange": false,
				"paneProperties.legendProperties.showOnlyPriceSource": true,
				"paneProperties.background": "#fff",
				"paneProperties.vertGridProperties.color": "#98b0cd",
				"paneProperties.horzGridProperties.color": "#98b0cd",
				"symbolWatermarkProperties.transparency": 90,
				"mainSeriesProperties.candleStyle.wickUpColor": '#336854',
				"mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
			},
		};

		const widget = window.tvWidget = new window.TradingView.widget(widgetOptions);
		widget.onChartReady(() => {});
		this.tvWidget = widget;
	};


	render() {
		return (
			<div
				id={ this.props.containerId }
				className={'trading-view'}
			/>
		);
	}
}

const mapStateToProps = (state) => ({
    currency: getExchangeCurrencySelector(state),
    ticker: getTickerSelector(state),
});

export default connect(mapStateToProps, null)(TradingView)
