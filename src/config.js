const prodSettings = require('./prod.config');
const devSettings = require('./development.config');

const config = {
    'development': devSettings,
    'production': prodSettings
};

const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];


module.exports = environmentConfig;
