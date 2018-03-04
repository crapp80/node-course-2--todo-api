const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // so we can use Promises instead of callbacks
// in CL: "heroku addons:create mongolab:sandbox", heroku config to see MONGODB_URI
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };
