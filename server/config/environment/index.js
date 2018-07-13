import path from 'path';
import _ from 'lodash';

// All configurations will extend these options
const all = {
  env: process.env.NODE_ENV || 'development',

  // Root path of server
  root: path.join(__dirname, '/../../..'),

  // Server port
  port: process.env.PORT || 3000,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'akdjfkljwoej1098293897',
    sessionExpires: 24 * 60 * 60 * 1000,
  },

  // List of user roles
  userRoles: ['user', 'seller'],

  // MongoDB connection options
  mongo: {
    options: {
      useMongoClient: true,
    },
  },

  sendgrid: {
    key: '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',
  },

  adminEmail: 'support@shoppe.com',

  amazon_sns: {
    accessKeyId: 'AKIAJHDXQKMNHNLTAPBA',
    secretAccessKey: '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',
    region: 'us-west-2'
  },

  facebook: {
    options: {
      version: 'v2.6',
      appSecret: '641c74e4e0f9d0e4ca93ef937b3f0710',
      appId: '1711857159104048',
    },
    userAccessToken: 'EAAYU5ZC9vqWsBABMXCkFYbij7IxyZCK4DCDWAhKRZAicbigKwgKPfZBUHUZBwogSTjVt4HrDVJx6yLd9s8MvF2Fgnmgc04u0wghD7Bbv48faLljKpaQZAjNy78xNn7U1vrg1zqqoquB0Lkgw4UMpZC5DR92qJb4bjRobGXtD5h1hAZDZD',
    pageId: '1691083867780869',
  },

  apiEndpointBase: 'http://shoppe.local.dev:8000/',
};

const extraEnv = require(`./${all.env}.js`).default;
export default _.merge(
  all,
  extraEnv || {},
);
