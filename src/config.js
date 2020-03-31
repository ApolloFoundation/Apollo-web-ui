/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


const config = {};

// API Gateway
config.api = {
    server: '',
    mixerUrl: 'http://51.15.228.126:8080/api/get-account',
    transportUrl: 'ws://127.0.0.1:8888/',
    faucetUrl: 'https://wallet.test.apollowallet.org'
};

config.api.serverUrl = `${config.api.server}/apl?`;

module.exports = config;
