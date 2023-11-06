import * as dotenv from 'dotenv';

dotenv.config();
export const ENV_CONFIG = {
  app: {
    port: 3005,
    hostname: '127.0.0.1',
    apiRoot: '/v1',
  },
  firebase: dotenv.config(),
};
