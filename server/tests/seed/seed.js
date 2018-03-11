const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

// dummy user objects
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'me@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userOneId.toHexString(), access: 'auth' }, 'mySecretSalt').toString(),
  }],
}, {
  _id: userTwoId,
  email: 'you@example.com',
  password: 'userTwoPass',
}];

// dummy test objects
const dummyTodos = [{
  _id: new ObjectID(),
  text: 'First test todo',
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
}];

// make sure the database is empty before every request & insert dummyTodos
const populateTodos = (done) => {
  Todo.remove({})
    .then(() => Todo.insertMany(dummyTodos))
    .then(() => done());
};

// make sure the database is empty & create dummy users
const populateUsers = (done) => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {
  dummyTodos,
  populateTodos,
  users,
  populateUsers,
};
