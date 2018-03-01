const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp'); //

  // deleteMany method
  // db.collection('Todos').deleteMany({ name: 'Eat lunch' }).then((result) => {
  //   console.log(result);
  //   console.log(result.deletedCount); // counts how many documents where deleted
  // });

  // deleteOne method
  // db.collection('Todos').deleteOne({ name: 'Eat lunch' }).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete method
  // db.collection('Todos').findOneAndDelete({ completed: false }).then((result) => {
  //   console.log(result);
  // });

  // lesson's challenge
  // db.collection('Users').deleteMany({ name: 'Carsten' }).then((result) => {
  //   console.log(`${result.deletedCount} documents deleted`);
  // });

  db.collection('Users').findOneAndDelete({ _id: new ObjectID('5a96495af44e9d5572d4c720') }).then((result) => {
    console.log(result);
  });

  // client.close();
});
