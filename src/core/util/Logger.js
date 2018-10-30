var winston = require('winston');
// require('winston-daily-rotate-file');

module.exports = function(Config)
{
	var config = Config.server;
	
	var transports = [
		new winston.transports.Console({
            level: this.env === 'dev' ? 'debug' : 'info',
            stderrLevels: ['warn', 'error'],
        }),
    ];
	
	if(config.logPath)
	{
		transports.push(new winston.transports.DailyRotateFile({
			filename: `${config.logPath}/server-%DATE%.log`,
			datePattern: 'YYYY-MM-DD-HH',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d',
		}));
	}
	
	return winston.createLogger({
		format: winston.format.json(),
		transports,
	});
}