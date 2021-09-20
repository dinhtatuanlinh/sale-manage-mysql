const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.File({ filename: 'info.log', level: 'info' }),
    ],
});
logger.add(new winston.transports.Console({
    format: winston.format.simple(),
}));
const logConfiguration = {
    'transports': [
        new winston.transports.File({
            level: 'info',
            filename: 'logs/example.log'
        })
    ]
};
const logger_a = winston.createLogger(logConfiguration);
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
module.exports = {
    logger_a,
    logger
};
// if (process.env.NODE_ENV !== 'production') {

// }