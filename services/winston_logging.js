const winston = require('winston');

const logConfiguration = {
    'transports': [
        new winston.transports.File({
            level: 'info',
            filename: 'logs/example.log'
        })
    ]
};
const logger = winston.createLogger(logConfiguration);
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
module.exports = logger;
// if (process.env.NODE_ENV !== 'production') {

// }