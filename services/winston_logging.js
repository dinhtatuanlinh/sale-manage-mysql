const winston = require('winston');
// const { createLogger, format, transports } = require("winston");
let date = new Date();
date = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
const logConfiguration = {
    'format': winston.format.combine(
        winston.format.simple(),
        winston.format.timestamp(),
        winston.format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)
    ),
    'transports': [
        new winston.transports.File({
            level: 'info', //đánh dấu dạng log
            filename: `logs/${date}.log` //file log
        }),
        new winston.transports.File({
            level: 'error',
            filename: `logs/${date}.log`
        }),
    ]
};
// tạo log bằng hàm createLogger
const logger = winston.createLogger(logConfiguration);

module.exports = logger;