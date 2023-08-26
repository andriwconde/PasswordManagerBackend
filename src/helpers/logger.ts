import winston from "winston";
import 'winston-daily-rotate-file';
const moment = require('moment');
import dotenv from 'dotenv';
dotenv.config()

const date = moment().format('DD-MM-YYYY hh:mm:ss')

const config = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'magenta',
        http: 'grey',
        verbose: 'cyan',
        debug: 'blue',
        silly: 'green'
    }
};
  
winston.addColors(config.colors);

export const logger = winston.createLogger({
    levels: config.levels,
    format: winston.format.combine(
        winston.format.simple(),
        winston.format.timestamp({format: date}),
        winston.format.printf(info => `[${info.timestamp}] - level: ${info.level} - ${info.message}`),
        winston.format.colorize({ all: true})
    ),
    transports: [
        new winston.transports.Console({
            level: 'silly'
        }),
        new winston.transports.DailyRotateFile({
            dirname: process.env.LOGS_PATH,
            filename: '%DATE%-errorMorfando.log',
            datePattern: 'DD-MM-YYYY-HH',
            frequency: '24h',
            maxSize: '5m',
            maxFiles: '15d',
            level:'error',
        })
    ],
    //Handling Uncaught Exceptions
    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            dirname: process.env.LOGS_PATH,
            filename: '%DATE%-exceptionsMorfando.log',
            datePattern: 'DD-MM-YYYY-HH',
            frequency: '24h',
            maxSize: '5m',
            maxFiles: '15d',
        })
    ],
    //Handling Uncaught Promise Rejections
    rejectionHandlers: [
        new winston.transports.DailyRotateFile({
            dirname: process.env.LOGS_PATH,
            filename: '%DATE%-rejectionsMorfando.log',
            datePattern: 'DD-MM-YYYY-HH',
            frequency: '24h',
            maxSize: '5m',
            maxFiles: '15d',
        })
    ]
})

