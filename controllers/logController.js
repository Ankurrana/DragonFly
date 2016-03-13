var winston = require('winston');
winston.add(winston.transports.File, { filename: '../logs/WinstonLogs.log' });
winston.remove(winston.transports.Console);
module.exports = winston;