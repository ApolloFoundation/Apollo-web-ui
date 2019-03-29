/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


const config = {};

// API Gateway
config.api = {
    server: 'http://192.168.1.138:7876', // Example: http://localhost:7876
    localServerUrl: 'https://apollocurrency.com/api/client/twitter',
    mixerUrl: 'https://apollowallet.org/mixer/api/get-account'
};

config.api.serverUrl = `${config.api.server}/apl?`;

module.exports = config;
