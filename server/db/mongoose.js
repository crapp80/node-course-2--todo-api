const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // so we can use Promises instead of callbacks
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };
