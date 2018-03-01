/* eslint-disable no-console */

const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // so we can use Promises instead of callbacks
mongoose.connect('mongodb://localhost:27017/TodoApp');

const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Number,
    default: null,
  },
});

// const newTodo = new Todo({
//   text: 'Edit blog post',
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved todo: ', doc);
// }, (e) => {
//   console.log('Unable to save todo.', e);
// });
//
const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
});

const newUser = new User({
  email: 'carsten.rapp@icloud.com',
});

newUser.save().then((doc) => {
  console.log('Saved user: ', doc);
}, (e) => {
  console.log('Unable to save user', e);
});
