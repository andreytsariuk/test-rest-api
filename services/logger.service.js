const winston = require('winston');
const {
  createLogger,
  format,
  transports
} = winston;
require('winston-daily-rotate-file');
const Elasticsearch = require('winston-elasticsearch');
const clc = require('cli-color');
const config = require('config');
const _ = require('lodash');
const moment = require('moment');
const os = require('os');


class LoggerService {
  constructor() {
    /**
     * Just a Map that provide colors depends on logging level
     * @type {Map}
     */
    this.colorsMap = new Map()
      .set('error', clc.red)
      .set('warn', clc.yellow)
      .set('info', clc.cyan);

    /**
     * internal instance of winston logger
     */
    this.__logger = createLogger({
      level: 'info',
      transports: [this.fileTransport]
    });

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'develop') {
      this.__logger.add(this.consoleTransport);
    }

    if (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production')
      this.__logger.add(this.elasticSearchTransport);

    process.on('uncaughtException', (err) => {
      this.error('uncaughtException', err);
    });
    process.on('unhandledRejection', (reason) => {
      this.error('unhandledRejection', reason);
    });

    const version = require('../package.json').version;

    this.CONFIG = {
      version
    };
  }


  /**
   * returns the function for formatting a file
   */
  get fileFormat() {
    return format
      .printf(info => {
        /**
         * @type {Array<any>}
         */
        let splat = info[Symbol.for('splat')];
        return `${info.timestamp} [${info.label}] ${info.level}: ` +
          `${info.message} ${splat ? splat.map(el=> el instanceof Error ? el.constructor.name + '\n' + el.message + el.stack :JSON.stringify(el)).join(''):''}`;
      });
  }
  /**
   * 
   */
  get consoleFormat() {
    return format.printf(info => {
      let start = this.colorsMap.get(info.level)(`${info.timestamp} [${info.label}] ${info.level}: `);
      /**
       * @type {Array<any>}
       */
      let splat = info[Symbol.for('splat')];
      if (info.stack) {
        return `${start} ${ this.colorsMap.get('error')(info.message + ' ' + info.stack)}`;
      } else {
        return `${start} ${info.message} ${  splat ? splat.map(el=> el instanceof Error ? ' ' + el.constructor.name + '\n' + el.message + el.stack :JSON.stringify(el)).join(''):''}`;
      }
    });
  }

  get fileTransport() {
    return new(winston.transports.DailyRotateFile)({
      filename: `logs/${config.get('WINSTON.INDEX_PREFIX')}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: format.combine(
        format.label({
          label: config.get('WINSTON.INDEX_PREFIX')
        }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        this.fileFormat
      )
    });
  }

  get consoleTransport() {
    return new transports.Console({
      format: format.combine(
        format.label({
          label: config.get('WINSTON.INDEX_PREFIX')
        }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss:SSS'
        }),
        this.consoleFormat
      )
    });
  }

  get elasticSearchTransport() {
    return new Elasticsearch({
      level: 'info',
      indexPrefix: config.get('WINSTON.INDEX_PREFIX'),
      indexSuffixPattern: config.get('WINSTON.INDEX_SUFFIX_PATTERN'),
      clientOpts: {
        host: config.get('ELASTIC_SEARCH.CONNECTION_URL'),
        log: config.get('ELASTIC_SEARCH.LOG'),
        requestTimeout: config.get('ELASTIC_SEARCH.REQUEST_TIMEOUT'),
        apiVersion: config.get('ELASTIC_SEARCH.API_VERSION')
      }
    });
  }

  /**
   * 
   * @param {any} message 
   */
  formatMessage(message) {
    const outMessage = {};

    if (typeof message === 'string') {
      outMessage.loggingMessage = message;
    } else if (typeof message === 'object' && message instanceof Array) {
      outMessage.array = message;
      outMessage.stringifyData = JSON.stringify(message);
    } else if (typeof message === 'object' && message instanceof Error) {
      outMessage.stack = message.stack;
      outMessage.loggingMessage = message.message;
      outMessage.type = message.constructor.name;
      outMessage.details = message.details;
      outMessage.errorType = typeof message;
      outMessage.stringifyData = JSON.stringify(message);
    } else if (typeof message === 'object' && message.stack !== undefined) {
      outMessage.stack = message.stack;
      outMessage.loggingMessage = message.message;
      outMessage.type = message.constructor.name;
      outMessage.details = message.details;
      outMessage.stringifyData = JSON.stringify(message);
    } else if (typeof message === 'object') {
      outMessage.data = message;
      outMessage.type = message.constructor.name;
      outMessage.objectType = typeof message;
      outMessage.stringifyData = JSON.stringify(message);
    } else {
      outMessage.loggingMessage = String(message);
      outMessage.stringifyData = JSON.stringify(message);
    }

    return outMessage;
  }

  /**
   *  Will log error and paste all required Data for logging
   * @param {string} errorType 
   * @param {any} loggingData 
   */
  error(errorType, loggingData) {
    if (!_.isString(errorType))
      throw new Error('Not Valid logging parameters. Please ensure that first param is a String type.');

    return this.__logger.error(errorType, {
      ...this.CONFIG,
      data: this.formatMessage(loggingData),
      date: moment().toISOString(),
      freemem: os.freemem(),
      totalmem: os.totalmem()
    });
  }


  /**
   * Will log warning please use just for WARN messages. 
   * @param {string} warningType 
   * @param {any} loggingData 
   */
  warn(warningType, loggingData) {
    if (!_.isString(warningType))
      throw new Error('Not Valid logging parameters. Please ensure that first param is a String type.');

    return this.__logger
      .warn(warningType, {
        ...this.CONFIG,
        data: this.formatMessage(loggingData),
        date: moment().toISOString(),
        freemem: os.freemem(),
        totalmem: os.totalmem()
      });
  }


  /**
   * Will log any Info message
   * @param {string} infoType 
   * @param {any} loggingData 
   */
  info(infoType, loggingData) {
    if (!_.isString(infoType))
      throw new Error('Not Valid logging parameters. Please ensure that first param is a String type.');

    return this.__logger.info(infoType, {
      ...this.CONFIG,
      data: this.formatMessage(loggingData),
      date: moment().toISOString(),
      freemem: os.freemem(),
      totalmem: os.totalmem()
    });
  }
}


const logger = new LoggerService();



module.exports = logger;