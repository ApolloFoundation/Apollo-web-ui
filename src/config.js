/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


const config = {};

// API Gateway
config.api = {
    server:'https://apl-exchange.testnet.apollowallet.org',
    localServerUrl: 'https://apollocurrency.com/api/client/twitter',
    mixerUrl: 'https://apollowallet.org/mixer/api/get-account',
    transportUrl: 'ws://127.0.0.1:8888/'
};

config.api.serverUrl = `${config.api.server}/apl?`;

module.exports = config;
