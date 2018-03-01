const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp'); //

  // db.collection('Todos').find({
  //   completed: false,
  //   // _id: new ObjectID('5a9646efb0a43e552d650c73'),
  // }).toArray().then((docs) => {
  //   console.log('Todos:');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  db.collection('Users').find({
    name: 'Carsten',
    // name: { $ne: 'Carsten' }, // not equal to
  }).toArray()
    .then((docs) => {
      console.log(`Users count: ${docs.length}`);
      console.log(docs);
    }, (err) => {
      console.log('Unable to fetch users', err);
    });

  // client.close();
});
