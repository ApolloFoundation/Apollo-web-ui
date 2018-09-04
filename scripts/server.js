'use strict';

const express = require('express');
const Twitter = require('twitter');
const bodyParser = require('body-parser');

const PORT = parseInt(process.env.SERVER_PORT, 10) || 3020;
const HOST = '0.0.0.0';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/twitter', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const client = new Twitter({
        consumer_key: '6gYLnBImEiEo8TCHwPeuvynEq',
        consumer_secret: 'lazH93imRsyHfJO3pe9B17vOcvdz2e6VonYW8PNiZG1HhZHee3',
        access_token_key: '496968447-TLL2aLv6IrMZBcZ9QFd6SqRROr4HcDFQOZJp9qXJ',
        access_token_secret: '4ce0TaLN1ipocuv6sW1d3x5lDcu6YtPfyn4GSol7E98UK'
    });

    const params = {
        screen_name: 'ApolloCurrency',
        tweet_mode: 'extended',
        exclude_replies: true,
        count: 20
    };

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            res.send(JSON.stringify({tweets, success: true}, null, 2));
        } else {
            res.send(JSON.stringify({success: false}, null, 2));
        }
    });

});

app.listen(PORT, HOST);