import { sprintf } from '../utils/sprintf';

const port =
  process.env.PORT || // Used by services that offer managed hosting e.g. Heroku
  process.env.APP_PORT ||
  9000;
const version = process.env.APP_VERSION || 'v1';

export default {
  version, // API mayor version
  // https://stackoverflow.com/questions/9153571/is-there-a-way-to-get-version-from-package-json-in-nodejs-code
  packageVersion: process.env.npm_package_version, // Exact version
  port,
  baseUrl: `${sprintf(
    process.env.APP_BASE_URL || 'http://localhost:%s',
    port.toString(),
  )}/${version}`,
  corsOrigins: (process.env.APP_CORS_ORIGIN || 'http://localhost:3000').split(
    ', ',
  ),
};
