const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
    getTimestamp() {
        return new Date().toISOString();
    }

    getLogFile(level) {
        const date = new Date().toISOString().split('T')[0];
        return path.join(logsDir, `${level.toLowerCase()}-${date}.log`);
    }

    formatMessage(level, message, data) {
        const timestamp = this.getTimestamp();
        const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
        return `[${timestamp}] [${level}] ${message}${dataStr}\n`;
    }

    info(message, data) {
        const logMessage = this.formatMessage('INFO', message, data);
        console.log(logMessage);
        fs.appendFileSync(this.getLogFile('info'), logMessage);
    }

    error(message, data) {
        const logMessage = this.formatMessage('ERROR', message, data);
        console.error(logMessage);
        fs.appendFileSync(this.getLogFile('error'), logMessage);
    }

    warn(message, data) {
        const logMessage = this.formatMessage('WARN', message, data);
        console.warn(logMessage);
        fs.appendFileSync(this.getLogFile('warn'), logMessage);
    }

    debug(message, data) {
        const logMessage = this.formatMessage('DEBUG', message, data);
        if (process.env.NODE_ENV === 'development') {
            console.log(logMessage);
        }
        fs.appendFileSync(this.getLogFile('debug'), logMessage);
    }
}

const requestLogger = new Logger();

module.exports = { Logger, requestLogger };