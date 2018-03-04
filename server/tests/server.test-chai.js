const chai = require('chai');
const chaiHTTP = require('chai-http');

const { app } = require('../server');
const { Todo } = require('../models/todo.js');

const should = chai.should();

chai.use(chaiHTTP);

// dummy test objects
const dummyTodos = [{
  text: 'First test todo',
}, {
  text: 'Second test todo',
}];

// make sure the database is empty before every request & insert dummyTodos
beforeEach((done) => {
  Todo.remove({})
    .then(() => Todo.insertMany(dummyTodos))
    .then(() => done());
});

describe('* USING CHAI * POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo test';

    chai.request(app)
      .post('/todos')
      .send({ text })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        res.should.have.status(200);
        res.body.text.should.equal(text);
        return Todo.find({ text }).then((todos) => {
          todos.should.have.lengthOf(1);
          todos[0].text.should.equal(text);
          done();
        }).catch(e => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    chai.request(app)
      .post('/todos')
      .send({})
      .end((err, res) => {
        res.should.have.status(400);
        return Todo.find().then((todos) => {
          todos.should.have.lengthOf(2);
          done();
        }).catch(e => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    chai.request(app)
      .get('/todos')
      .then((res) => {
        res.should.have.status(200);
        res.body.todos.should.have.lengthOf(2);
        done();
      }).catch(e => done(e));
  });
});
