import winston from 'winston';
import expressWinston from 'express-winston';

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

export default errorLogger;
