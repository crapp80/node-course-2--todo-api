/* eslint-disable no-console */
const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const id = '5a987347236c9c5fa2798828';

if (!ObjectID.isValid(id)) {
  console.log('ID not valid.');
}

// Todo.find({
//   _id: id,
// }).then((todos) => {
//   console.log('Todos: ', todos);
// });
//
// Todo.findOne({
//   _id: id,
// }).then((todo) => {
//   console.log('Todo: ', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('ID not found.');
//   }
//   return console.log('Todo by ID: ', todo);
// }).catch(e => console.log(e));

User.findById(id).then((user) => {
  if (!user) {
    return console.log('Unable to find user.');
  }
  return console.log('User by ID: ', user);
}).catch(e => console.log(e));
