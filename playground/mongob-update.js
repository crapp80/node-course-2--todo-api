/* eslint-disable no-console */

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5a9825722e0b002ea6938fb6'),
  // }, {
  //   $set: { // update operator is needed!
  //     completed: true,
  //   },
  // }, {
  //   returnOriginal: false,
  // }).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').findOneAndUpdate({
  //   _id: new ObjectID('5a96485a321792556841520e'),
  // }, {
  //   $set: {
  //     name: 'Carsten',
  //   },
  // }, {
  //   returnOriginal: false,
  // }).then((result) => {
  //   console.log(result);
  //   console.log(`Name changed to: ${result.value.name}`);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a96485a321792556841520e'),
  }, {
    $set: { // sets the value of a field, in this case the name field
      name: 'Anja',
    },
    $inc: { // increases or decreases a numeric value, in this case the age field
      age: 1,
    },
  }, {
    returnOriginal: false,
  }).then((result) => {
    console.log(result);
  });

  // client.close();
});
