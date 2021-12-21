export const dashboardMenu = {
	className: ['/', '/dashboard'],
	to: '/',
	label: 'Dashboard',
	icon: 'zmdi-view-dashboard',
	children: [
		{className: '/ledger', to: '/ledger', label: 'Account ledger', icon: 'zmdi-view-dashboard'},
		{className: '/account-properties', to: '/account-properties', label: 'Account properties', icon: 'zmdi-view-dashboard'},
		{className: '/transactions', to: '/transactions', label: 'My transactions', icon: 'zmdi-view-dashboard'},
		{className: '/approval-request', to: '/approval-request', label: 'Approval requests', icon: 'zmdi-view-dashboard'},
	],
};

export const exchangeMenu = {
	className: '/dex',
	to: '/dex',
	label: 'Exchange',
	icon: 'zmdi-refresh',
	children: [
		{className: '/choose-wallet', to: '/choose-wallet', label: 'Choose wallet', icon: 'zmdi-case'},
		{className: '/order-history', to: '/order-history', label: 'Order history', icon: 'zmdi-chart'},
		{className: '/trade-history-exchange', to: '/trade-history-exchange', label: 'Trade history', icon: 'zmdi-chart'},
	],
};

export const assetExchangeMenu = {
	className: '/asset-exchange',
	to: '/asset-exchange',
	label: 'Asset exchange',
	icon: 'zmdi-case',
	additionalChildren: {id: 'open-issue-asset', label: 'Issue assets', modalType: 'ISSUE_ASSET'},
	children: [
		{className: '/all-assets', to: '/all-assets', label: 'All assets', icon: 'zmdi-case'},
		{className: '/my-assets', to: '/my-assets', label: 'My assets', icon: 'zmdi-case'},
		{className: '/trade-history', to: '/trade-history', label: 'Trade history', icon: 'zmdi-case'},
		{className: '/transfer-history', to: '/transfer-history', label: 'Transfer history', icon: 'zmdi-case'},
		{className: '/delete-history', to: '/delete-history', label: 'Delete history', icon: 'zmdi-case'},
		{className: '/open-orders', to: '/open-orders', label: 'Open orders', icon: 'zmdi-case'},
	],
};

export const currencySystemMenu = {
	className: '/currencies',
	to: '/currencies',
	label: 'Currencies',
	icon: 'zmdi-money',
	additionalChildren: {id: 'open-issue-currency', label: 'Issue currencies', modalType: 'ISSUE_CURRENCIES'},
	children: [
		{className: '/my-currencies', to: '/my-currencies', label: 'My currencies', icon: 'zmdi-money'},
		{className: '/transfer-history-currency', to: '/transfer-history-currency', label: 'Transfer history', icon: 'zmdi-money'},
		{className: '/exchange-history-currency', to: '/exchange-history-currency', label: 'Exchange history', icon: 'zmdi-money'},
	],
};

export const smartContracts = (to) => ({
  className: ['/smc'],
  to,
  isExternal: true,
  label: "Contracts",
  icon: "zmdi-collection-text",
});

export const dfs = {
  className: [process.env.REACT_APP_DFS_URL],
  to: process.env.REACT_APP_DFS_URL,
  isExternal: true,
  label: "Distributed file storage ",
  icon: "zmdi-storage",
};

export const votingSystemMenu = {
	className: '/active-polls',
	to: '/active-polls',
	label: 'Active polls',
	icon: 'zmdi-star',
	additionalChildren: {id: 'open-create-poll', label: 'Create poll', modalType: 'ISSUE_POLL'},
	children: [
		{className: '/finished-polls', to: '/finished-polls', label: 'Finished polls', icon: 'zmdi-star'},
		{className: '/followed-polls', to: '/followed-polls', label: 'Followed polls', icon: 'zmdi-star'},
		{className: '/my-votes', to: '/my-votes', label: 'My votes', icon: 'zmdi-star'},
		{className: '/my-polls', to: '/my-polls', label: 'My polls', icon: 'zmdi-star'},
	],
};

export const dataStorageMenu = {
	className: '/data-storage',
	to: '/data-storage',
	label: 'Data storage',
	icon: 'zmdi-dns',
	additionalChildren: {id: 'open-file-upload', label: 'File upload', modalType: 'ISSUE_FILE_UPLOAD'},
	children: [],
};

export const marketplaceMenu = {
	className: '/marketplace',
	to: '/marketplace',
	label: 'Marketplace',
	icon: 'zmdi-label',
	additionalChildren: {id: 'open-list-product-for-sale', label: 'List product for sale', modalType: 'LIST_PRODUCT_FOR_SALE'},
	children: [
		{className: '/purchased-products', to: '/purchased-products', label: 'Purchased products', icon: 'zmdi-label'},
		{className: '/my-products-for-sale', to: '/my-products-for-sale', label: 'My products for sale', icon: 'zmdi-label'},
		{className: '/my-pending-orders', to: '/my-pending-orders', label: 'My pending orders', icon: 'zmdi-label'},
		{className: '/my-completed-orders', to: '/my-completed-orders', label: 'My completed orders', icon: 'zmdi-label'},
	],
};

export const coinShufflingMenu = {
	className: '/active-shuffling',
	to: '/active-shuffling',
	label: 'Coin shuffling',
	icon: 'zmdi-circle-o',
	additionalChildren: {id: 'open-create-shuffling', label: 'Create shuffling', modalType: 'ISSUE_CREATE_SHUFFLING'},
	children: [
		{className: '/finished-shuffling', to: '/finished-shuffling', label: 'Finished shuffling', icon: 'zmdi-circle-o'},
		{className: '/my-shuffling', to: '/my-shuffling', label: 'My shuffling', icon: 'zmdi-circle-o'},
	],
};

export const messagesMenu = {
	className: '/my-messages',
	to: '/my-messages',
	label: 'Messages',
	icon: 'zmdi-comments',
	children: [
		{className: '/messenger', to: '/messenger', label: 'Chat', icon: 'zmdi-comments'},
	],
};

export const aliasesMenu = {
	className: '/aliases',
	to: '/aliases',
	label: 'Search Aliases',
	icon: 'zmdi-accounts',
	children: [
		{className: '/my-aliases', to: '/my-aliases', label: 'My Aliases', icon: 'zmdi-accounts'},
	],
};
