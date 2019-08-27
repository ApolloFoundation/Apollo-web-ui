/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


const config = {};

// API Gateway
config.api = {
    server: 'http://51.15.114.68',
    mixerUrl: 'https://apollowallet.org/mixer/api/get-account',
    transportUrl: 'ws://127.0.0.1:8888/',
    faucetUrl: 'https://wallet.test.apollowallet.org'
};

config.api.serverUrl = `${config.api.server}/apl?`;

module.exports = config;
