import { createLogger } from 'vue-logger-plugin';

const isProduction = process.env.NODE_ENV === 'production';

// create logger with options
// https://www.npmjs.com/package/vue-logger-plugin
const logger = createLogger({
  enabled: true,
  // Levels: log <-- error <-- warn <-- info <-- debug
  level: isProduction ? 'info' : 'debug',
  // whether information about the caller function should be included
  callerInfo: true,
});

export default logger;
