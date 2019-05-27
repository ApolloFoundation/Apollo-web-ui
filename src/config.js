/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


const config = {};

// API Gateway
config.api = {
    server: 'http://192.168.1.142:7876',
    localServerUrl: 'https://apollocurrency.com/api/client/twitter',
    mixerUrl: 'https://apollowallet.org/mixer/api/get-account',
    transportUrl: 'ws://127.0.0.1:8888/'
};

config.api.serverUrl = `${config.api.server}/apl?`;

module.exports = config;
