/* eslint-disable no-console */
const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// Remove everything
Todo.remove({}).then((result) => {
  console.log(result);
});

// Remove the first done
// Todo.findOneAndRemove()

// Remove by ID
Todo.findByIdAndRemove('5a9c6e9d2e0b002ea693e510').then((todo) => {
  console.log(todo);
});
