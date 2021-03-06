// Production specific configuration
// =================================
export default {
  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||
        process.env.PORT ||
        8080,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL ||
        process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
        'mongodb://localhost/scheduler',
  },
};
