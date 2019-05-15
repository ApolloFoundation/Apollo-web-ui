/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/
import React from 'react';

export const INIT_TRANSACTION_TYPES = {
    0: {
        'title': "Payment",
        'i18nKeyTitle': 'payment',
        'iconHTML': <i class='fa fa-calculator'></i>,
        'subTypes': {
            0: {
                'title': "Ordinary Payment",
                'i18nKeyTitle': 'ordinary_payment',
                'iconHTML': <i className="zmdi zmdi-money left"/>,
                'receiverPage': 'transactions'
            },
            1: {
                'title': "Private Payment",
                'i18nKeyTitle': 'private_payment',
                'iconHTML': <i className="zmdi zmdi-money left"/>,
                'receiverPage': 'transactions'
            }
        }
    },
    1: {
        'title': "Messaging/Voting/Aliases",
        'i18nKeyTitle': 'messaging_voting_aliases',
        'iconHTML': <i class='fa fa-envelope'></i>,
        'subTypes': {
            0: {
                'title': "Arbitrary Message",
                'i18nKeyTitle': 'arbitrary_message',
                'iconHTML': <i className="zmdi zmdi-comments left"/>,
                'receiverPage': 'messages'
            },
            1: {
                'title': "Alias Assignment",
                'i18nKeyTitle': 'alias_assignment',
                'iconHTML': <i className="zmdi zmdi-accounts left" />
            },
            2: {
                'title': "Poll Creation",
                'i18nKeyTitle': 'poll_creation',
                'iconHTML': <i className="zmdi zmdi-star left"/>
            },
            3: {
                'title': "Vote Casting",
                'i18nKeyTitle': 'vote_casting',
                'iconHTML': <i className="zmdi zmdi-star left"/>
            },
            4: {
                'title': "Hub Announcement",
                'i18nKeyTitle': 'hub_announcement',
                'iconHTML': <i class='ion-radio-waves'></i>
            },
            5: {
                'title': "Account Info",
                'i18nKeyTitle': 'account_info',
                'iconHTML': <i class='fa fa-info'></i>
            },
            6: {
                'title': "Alias Sale/Transfer",
                'i18nKeyTitle': 'alias_sale_transfer',
                'iconHTML': <i className="zmdi zmdi-accounts left" />,
                'receiverPage': "aliases"
            },
            7: {
                'title': "Alias Buy",
                'i18nKeyTitle': 'alias_buy',
                'iconHTML': <i className="zmdi zmdi-accounts left" />,
                'receiverPage': "aliases"
            },
            8: {
                'title': "Alias Deletion",
                'i18nKeyTitle': 'alias_deletion',
                'iconHTML': <i className="zmdi zmdi-accounts left" />
            },
            9: {
                'title': "Transaction Approval",
                'i18nKeyTitle': 'transaction_approval',
                'iconHTML': <i class='fa fa-gavel'></i>,
                'receiverPage': "transactions"
            },
            10: {
                'title': "Account Property",
                'i18nKeyTitle': 'account_property',
                'iconHTML': <i class='fa fa-gavel'></i>,
                'receiverPage': "transactions"
            },
            11: {
                'title': "AccountPropertyDelete",
                'i18nKeyTitle': 'account_property_delete',
                'iconHTML': <i class='fa fa-question'></i>,
                'receiverPage': "transactions"
            }
        }
    },
    2: {
        'title': "Asset Exchange",
        'i18nKeyTitle': 'asset_exchange',
        'iconHTML': <i class="fa fa-signal"></i>,
        'subTypes': {
            0: {
                'title': "Asset Issuance",
                'i18nKeyTitle': 'asset_issuance',
                'iconHTML': <i className="zmdi zmdi-case left"/>
            },
            1: {
                'title': "Asset Transfer",
                'i18nKeyTitle': 'asset_transfer',
                'iconHTML': <i className="zmdi zmdi-case left"/>,
                'receiverPage': "transfer_history"
            },
            2: {
                'title': "Ask Order Placement",
                'i18nKeyTitle': 'ask_order_placement',
                'iconHTML': <i className="zmdi zmdi-case left"/>,
                'receiverPage': "open_orders"
            },
            3: {
                'title': "Bid Order Placement",
                'i18nKeyTitle': 'bid_order_placement',
                'iconHTML': <i className="zmdi zmdi-case left"/>,
                'receiverPage': "open_orders"
            },
            4: {
                'title': "Ask Order Cancellation",
                'i18nKeyTitle': 'ask_order_cancellation',
                'iconHTML': <i className="zmdi zmdi-case left"/>,
                'receiverPage': "open_orders"
            },
            5: {
                'title': "Bid Order Cancellation",
                'i18nKeyTitle': 'bid_order_cancellation',
                'iconHTML': <i className="zmdi zmdi-case left"/>,
                'receiverPage': "open_orders"
            },
            6: {
                'title': "Dividend Payment",
                'i18nKeyTitle': 'dividend_payment',
                'iconHTML': <i className="zmdi zmdi-case left"/>,
                'receiverPage': "transactions"
            },
            7: {
                'title': "Delete Asset Shares",
                'i18nKeyTitle': 'delete_asset_shares',
                'iconHTML': <i className="zmdi zmdi-case left"/>,
                'receiverPage': "transactions"
            }
        }
    },
    3: {
        'title': "Marketplace",
        'i18nKeyTitle': 'marketplace',
        'iconHTML': <i class="fa fa-shopping-cart"></i>,
        'subTypes': {
            0: {
                'title': "Marketplace Listing",
                'i18nKeyTitle': 'marketplace_listing',
                'iconHTML': <i className="zmdi zmdi-label left"/>
            },
            1: {
                'title': "Marketplace Removal",
                'i18nKeyTitle': 'marketplace_removal',
                'iconHTML': <i className="zmdi zmdi-label left"/>
            },
            2: {
                'title': "Marketplace Price Change",
                'i18nKeyTitle': 'marketplace_price_change',
                'iconHTML': <i className="zmdi zmdi-label left"/>
            },
            3: {
                'title': "Marketplace Quantity Change",
                'i18nKeyTitle': 'marketplace_quantity_change',
                'iconHTML': <i className="zmdi zmdi-label left"/>
            },
            4: {
                'title': "Marketplace Purchase",
                'i18nKeyTitle': 'marketplace_purchase',
                'iconHTML': <i className="zmdi zmdi-label left"/>,
                'receiverPage': "pending_orders_dgs"
            },
            5: {
                'title': "Marketplace Delivery",
                'i18nKeyTitle': 'marketplace_delivery',
                'iconHTML': <i className="zmdi zmdi-label left"/>,
                'receiverPage': "purchased_dgs"
            },
            6: {
                'title': "Marketplace Feedback",
                'i18nKeyTitle': 'marketplace_feedback',
                'iconHTML': <i className="zmdi zmdi-label left"/>,
                'receiverPage': "completed_orders_dgs"
            },
            7: {
                'title': "Marketplace Refund",
                'i18nKeyTitle': 'marketplace_refund',
                'iconHTML': <i className="zmdi zmdi-label left"/>,
                'receiverPage': "purchased_dgs"
            }
        }
    },
    4: {
        'title': "Account Control",
        'i18nKeyTitle': 'account_control',
        'iconHTML': <i class="ion-locked"></i>,
        'subTypes': {
            0: {
                'title': "Balance Leasing",
                'i18nKeyTitle': 'balance_leasing',
                'iconHTML': <i className="zmdi zmdi-account left" />,
                'receiverPage': "transactions"
            },
            1: {
                'title': "Mandatory Approval",
                'i18nKeyTitle': 'phasing_only',
                'iconHTML': <i className="zmdi zmdi-account left" />,
                'receiverPage': "transactions"
            }
        }
    },
    5: {
        'title': "Monetary System",
        'i18nKeyTitle': 'monetary_system',
        'iconHTML': <i class="fa fa-bank"></i>,
        'subTypes': {
            0: {
                'title': "Issue Currency",
                'i18nKeyTitle': 'issue_currency',
                'iconHTML': <i className="zmdi zmdi-money left"/>
            },
            1: {
                'title': "Reserve Increase",
                'i18nKeyTitle': 'reserve_increase',
                'iconHTML': <i class="fa fa-cubes"></i>
            },
            2: {
                'title': "Reserve Claim",
                'i18nKeyTitle': 'reserve_claim',
                'iconHTML': <i class="fa fa-truck"></i>,
                'receiverPage': "currencies"
            },
            3: {
                'title': "Currency Transfer",
                'i18nKeyTitle': 'currency_transfer',
                'iconHTML': <i className="zmdi zmdi-money left"/>,
                'receiverPage': "currencies"
            },
            4: {
                'title': "Publish Exchange Offer",
                'i18nKeyTitle': 'publish_exchange_offer',
                'iconHTML': <i className="zmdi zmdi-money left"/>
            },
            5: {
                'title': "Buy Currency",
                'i18nKeyTitle': 'currency_buy',
                'iconHTML': <i className="zmdi zmdi-money left"/>,
                'receiverPage': "currencies"
            },
            6: {
                'title': "Sell Currency",
                'i18nKeyTitle': 'currency_sell',
                'iconHTML': <i className="zmdi zmdi-money left"/>,
                'receiverPage': "currencies"
            },
            7: {
                'title': "Mint Currency",
                'i18nKeyTitle': 'mint_currency',
                'iconHTML': <i className="zmdi zmdi-money left"/>,
                'receiverPage': "currencies"
            },
            8: {
                'title': "Delete Currency",
                'i18nKeyTitle': 'delete_currency',
                'iconHTML': <i className="zmdi zmdi-money left"/>
            }
        }
    },
    6: {
        'title': "Data Cloud",
        'i18nKeyTitle': 'tagged_data',
        'iconHTML': <i class="fa fa-dashboard"></i>,
        'subTypes': {
            0: {
                'title': "Upload Data",
                'i18nKeyTitle': 'upload_tagged_data',
                'iconHTML': <i className="zmdi zmdi-dns left"/>
            },
            1: {
                'title': "Extend Data Lifetime",
                'i18nKeyTitle': 'extend_tagged_data',
                'iconHTML': <i className="zmdi zmdi-dns left"/>
            }
        }
    },
    7: {
        'title': "Shuffling",
        'i18nKeyTitle': 'shuffling',
        'iconHTML': <i class="fa fa-random"></i>,
        'subTypes': {
            0: {
                'title': "Shuffling Creation",
                'i18nKeyTitle': 'shuffling_creation',
                'iconHTML': <i className="zmdi zmdi-circle-o left"/>
            },
            1: {
                'title': "Shuffling Registration",
                'i18nKeyTitle': 'shuffling_registration',
                'iconHTML': <i className="zmdi zmdi-circle-o left"/>
            },
            2: {
                'title': "Shuffling Processing",
                'i18nKeyTitle': 'shuffling_processing',
                'iconHTML': <i className="zmdi zmdi-circle-o left"/>
            },
            3: {
                'title': "Shuffling Recipients",
                'i18nKeyTitle': 'shuffling_recipients',
                'iconHTML': <i className="zmdi zmdi-circle-o left"/>
            },
            4: {
                'title': "Shuffling Verification",
                'i18nKeyTitle': 'shuffling_verification',
                'iconHTML': <i className="zmdi zmdi-circle-o left"/>
            },
            5: {
                'title': "Shuffling Cancellation",
                'i18nKeyTitle': 'shuffling_cancellation',
                'iconHTML': <i className="zmdi zmdi-circle-o left"/>
            }
        }
    }
};
