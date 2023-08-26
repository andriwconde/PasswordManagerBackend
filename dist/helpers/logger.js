"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const moment = require('moment');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const date = moment().format('DD-MM-YYYY hh:mm:ss');
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
winston_1.default.addColors(config.colors);
exports.logger = winston_1.default.createLogger({
    levels: config.levels,
    format: winston_1.default.format.combine(winston_1.default.format.simple(), winston_1.default.format.timestamp({ format: date }), winston_1.default.format.printf(info => `[${info.timestamp}] - level: ${info.level} - ${info.message}`), winston_1.default.format.colorize({ all: true })),
    transports: [
        new winston_1.default.transports.Console({
            level: 'silly'
        }),
        new winston_1.default.transports.DailyRotateFile({
            dirname: process.env.LOGS_PATH,
            filename: '%DATE%-errorMorfando.log',
            datePattern: 'DD-MM-YYYY-HH',
            frequency: '24h',
            maxSize: '5m',
            maxFiles: '15d',
            level: 'error',
        })
    ],
    //Handling Uncaught Exceptions
    exceptionHandlers: [
        new winston_1.default.transports.DailyRotateFile({
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
        new winston_1.default.transports.DailyRotateFile({
            dirname: process.env.LOGS_PATH,
            filename: '%DATE%-rejectionsMorfando.log',
            datePattern: 'DD-MM-YYYY-HH',
            frequency: '24h',
            maxSize: '5m',
            maxFiles: '15d',
        })
    ]
});
