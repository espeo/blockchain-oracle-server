/* eslint-disable no-console */

import LoggerPort from '../domain/common/port/LoggerPort';

class ConsoleLoggerAdapter extends LoggerPort {
  info(message) {
    console.log(message);
  }

  error(message, error) {
    console.error(message, error);
  }
}

export default ConsoleLoggerAdapter;