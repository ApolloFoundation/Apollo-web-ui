export const dashboardMenu = [
	{ to: '/',  label: 'Dashboard', icon: 'zmdi-view-dashboard'},
	{ to: '/ledger', label: 'Account ledger', icon: 'zmdi-view-dashboard'},
	{ to: '/account-properties', label: 'Account properties', icon: 'zmdi-view-dashboard'},
	{ to: '/transactions', label: 'My transactions', icon: 'zmdi-view-dashboard'},
	{ to: '/approval-request', label: 'Approval requests', icon: 'zmdi-view-dashboard'},
];

export const exchangeMenu = [
	{ to: '/dex',  label: 'Exchange', icon: 'zmdi-refresh'},
	{ to: '/choose-wallet', label: 'Choose wallet', icon: 'zmdi-case'},
	{ to: '/order-history', label: 'Order history', icon: 'zmdi-chart'},
	{ to: '/trade-history-exchange', label: 'Trade history', icon: 'zmdi-chart'},
];

export const assetExchangeMenu = [
	{ to: '/asset-exchange',  label: 'Asset exchange', icon: 'zmdi-case'},
	{ to: '/all-assets', label: 'All assets', icon: 'zmdi-case'},
	{ to: '/my-assets', label: 'My assets', icon: 'zmdi-case'},
	{ to: '/trade-history', label: 'Trade history', icon: 'zmdi-case'},
	{ to: '/transfer-history', label: 'Transfer history', icon: 'zmdi-case'},
	{ to: '/delete-history', label: 'Delete history', icon: 'zmdi-case'},
	{ to: '/open-orders', label: 'Open orders', icon: 'zmdi-case'},
	{ id: 'open-issue-asset', label: 'Issue assets', modalType: 'ISSUE_ASSET'}
];

export const currencySystemMenu =[
	{ to: '/currencies',  label: 'Currencies', icon: 'zmdi-money'},
	{ to: '/my-currencies', label: 'My currencies', icon: 'zmdi-money'},
	{ to: '/transfer-history-currency', label: 'Transfer history', icon: 'zmdi-money'},
	{ to: '/exchange-history-currency', label: 'Exchange history', icon: 'zmdi-money'},
	{ id: 'open-issue-currency', label: 'Issue currencies', modalType: 'ISSUE_CURRENCIES'}
];

export const smartContracts = {
	isSmartContract: true,
  to: '#',
  isExternal: true,
  label: "Contracts",
  icon: "zmdi-collection-text",
};

export const dfs = {
  className: [process.env.REACT_APP_DFS_URL],
  to: process.env.REACT_APP_DFS_URL,
  isExternal: true,
  label: "Distributed file storage ",
  icon: "zmdi-storage",
};

export const votingSystemMenu = [
	{ to: '/active-polls',  label: 'Active polls', icon: 'zmdi-star'},
	{ to: '/finished-polls', label: 'Finished polls', icon: 'zmdi-star'},
	{ to: '/followed-polls', label: 'Followed polls', icon: 'zmdi-star'},
	{ to: '/my-votes', label: 'My votes', icon: 'zmdi-star'},
	{ to: '/my-polls', label: 'My polls', icon: 'zmdi-star'},
	{id: 'open-create-poll', label: 'Create poll', modalType: 'ISSUE_POLL'}
];

export const dataStorageMenu =[
	{ to: '/data-storage',  label: 'Data storage', icon: 'zmdi-dns'},
	{ id: 'open-file-upload', label: 'File upload', modalType: 'ISSUE_FILE_UPLOAD'}
];

export const marketplaceMenu = [
	{ to: '/marketplace',  label: 'Marketplace', icon: 'zmdi-label'},
	{ to: '/purchased-products', label: 'Purchased products', icon: 'zmdi-label'},
	{ to: '/my-products-for-sale', label: 'My products for sale', icon: 'zmdi-label'},
	{ to: '/my-pending-orders', label: 'My pending orders', icon: 'zmdi-label'},
	{ to: '/my-completed-orders', label: 'My completed orders', icon: 'zmdi-label'},
	{id: 'open-list-product-for-sale', label: 'List product for sale', modalType: 'LIST_PRODUCT_FOR_SALE'}
];

export const coinShufflingMenu = [
	{ to: '/active-shuffling',  label: 'Coin shuffling', icon: 'zmdi-circle-o'},
	{ to: '/finished-shuffling', label: 'Finished shuffling', icon: 'zmdi-circle-o'},
	{ to: '/my-shuffling', label: 'My shuffling', icon: 'zmdi-circle-o'},
	{ id: 'open-create-shuffling', label: 'Create shuffling', modalType: 'ISSUE_CREATE_SHUFFLING'}
];

export const messagesMenu =  [
	{ to: '/my-messages',  label: 'Messages', icon: 'zmdi-comments'},
	{ to: '/messenger', label: 'Chat', icon: 'zmdi-comments'},
];

export const aliasesMenu = [
	{ to: '/aliases', label: 'Search Aliases', icon: 'zmdi-accounts'},
	{ to: '/my-aliases', label: 'My Aliases', icon: 'zmdi-accounts'},
];
