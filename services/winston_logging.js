const winston = require('winston');
let date = new Date();
date = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
const logConfiguration = {
    'transports': [
        new winston.transports.File({
            level: 'info',
            filename: `logs/${date}.log`
        }),
        new winston.transports.File({
            level: 'error',
            filename: `logs/${date}.log`
        }),
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