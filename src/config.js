/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


const config = {};

// API Gateway
config.api = {
    serverUrl: 'http://localhost:7876/apl?',
    localServerUrl: 'https://apollowallet.org/api/twitter',
    mixerUrl: 'http://51.15.72.23:8080/api/get-account'
};

module.exports = config;
