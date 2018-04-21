//TODO: reset all tokens/secrets

var config = {};

config.discord = {
    autorun: true,
    token: "MjE0OTEyNjMyOTU0NjgzMzk0.DbxowA.JuXok99roTXnWttEmDgN2zGVJ-g"
};

config.pusher = {
    appId: '241889',
    key: '3aa26893ee89f046e2a3',
    secret: '38b7e8bf90e6a743992a',
    encrypted: true
};

config.passport = {
    authorizationURL: 'https://discordapp.com/api/oauth2/authorize',
    tokenURL: 'https://discordapp.com/api/oauth2/token',
    clientID: '214912632954683394',
    clientSecret: 'EjArQSnT6-3Y59fAWDHLJPZj_fcjF-vb',
    // callbackURL: 'http://unitegamers.us' + '/login/auth'
    callbackURL: 'http://localhost:5000' + '/login/auth'
};

module.exports = config;