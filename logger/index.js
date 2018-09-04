import { createLogger, format, transports } from 'winston';
import stringify from 'json-stringify-safe';

export default createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.splat(),
        format.printf(info => {
            let splat = Object.getOwnPropertySymbols(info)[1];
            return `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message} ${stringify(info[splat])}`;
        })
    ),
    transports: [
        new transports.File({
            level: 'debug',
            json: true,
            filename: './app.log',
            timestamp: true,
            handleExceptions: true
        })
    ],
    exitOnError: false
});
