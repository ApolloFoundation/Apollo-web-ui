import * as React from 'react';
import './index.scss';

// import { widget } from 'charting_library/charting_library.min.js'


function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export default class TVChartContainer extends React.PureComponent {
	static defaultProps = {
		symbol: 'AAPL',
		interval: '15',
		containerId: 'tv_chart_container',
		datafeedUrl: 'https://demo_feed.tradingview.com',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
	};

	tvWidget = null;

	componentDidMount() {
		this.createTVChart();
	}

	createTVChart = () => {
		const widgetOptions = {
			symbol: this.props.symbol,
			// BEWARE: no trailing slash is expected in feed URL
			datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			locale: getLanguageFromURL() || 'en',
			disabled_features: ['has_empty_bars', 'scales_context_menu', 'context_menus', 'volume_force_overlay', 'timeframes_toolbar', 'scales_context_menu', 'header_chart_type', 'header_symbol_search', 'header_compare', 'header_undo_redo', 'header_saveload', 'header_screenshot'],
			enabled_features: ['hide_left_toolbar_by_default', 'hide_last_na_study_output'],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
		};
		
		console.log(widgetOptions);
		
		const widget = window.tvWidget = new window.TradingView.widget(widgetOptions);
		widget.onChartReady(() => {
		});
		this.tvWidget = widget;
		
		widget.onChartReady(() => {
			widget.headerReady().then(() => {
				const button = widget.createButton();
				button.setAttribute('title', 'Click to show a notification popup');
				button.classList.add('apply-common-tooltip');
				button.addEventListener('click', () => widget.showNoticeDialog({
					title: 'Notification',
					body: 'TradingView Charting Library API works correctly',
					callback: () => {
						console.log('Noticed!');
					},
				}));

				button.innerHTML = 'Check API';
			});
		});
	}

	componentWillUnmount() {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
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
