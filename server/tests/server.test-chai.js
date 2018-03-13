/* ignore error when calling the '_id' property on dummyTodos */
/* eslint-disable no-underscore-dangle */

const chai = require('chai');
const chaiHTTP = require('chai-http');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo.js');
const { User } = require('../models/user');
const {
  dummyTodos,
  populateTodos,
  users,
  populateUsers,
} = require('./seed/seed');

const should = chai.should();
const { expect } = require('chai');

chai.use(chaiHTTP);

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    chai.request(app)
      .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.todo.text.should.equals(dummyTodos[0].text);
        done();
      }).catch(e => done(e));
  });

  it('should return 404 if todo not found', (done) => {
    // create a valid ObjectID
    const id = new ObjectID().toHexString();
    chai.request(app)
      .get(`/todos/${id}`)
      .end((res) => {
        res.should.have.status(404);
        return done();
      });
  });

  it('should return 404 for non-object ids', (done) => {
    // create an invaild ObjectID
    const id = '123';
    chai.request(app)
      .get(`/todos/${id}`)
      .end((res) => {
        res.should.have.status(404);
        return done();
      });
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete a todo by ID', (done) => {
    const id = dummyTodos[1]._id.toHexString();
    chai.request(app)
      .delete(`/todos/${id}`)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        res.body.todo._id.should.equals(id);
        return Todo.findById(id).then((todo) => {
          // switched to expect assertion library, because should
          // can't assert this case
          expect(todo).to.be.null;
          done();
        }).catch(e => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    // create a valid ObjectID
    const id = new ObjectID().toHexString();
    chai.request(app)
      .delete(`/todos/${id}`)
      .end((res) => {
        res.should.have.status(404);
        return done();
      });
  });

  it('should return 404 for non-object ids', (done) => {
    // create an invaild ObjectID
    const id = '123';
    chai.request(app)
      .delete(`/todos/${id}`)
      .end((res) => {
        res.should.have.status(404);
        return done();
      });
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    const id = dummyTodos[0]._id.toHexString();
    const text = 'Todo changed';

    chai.request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: true,
        text,
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        res.should.have.status(200);
        res.body.todo.text.should.equal(text);
        res.body.todo.completed.should.be.true;
        res.body.todo.completedAt.should.be.a('number');
        return done();
      });
  });

  it('should clear completedAt when todo is not completed', (done) => {
    const id = dummyTodos[1]._id.toHexString();
    const text = 'Todo changed';

    chai.request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: false,
        text,
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        res.should.have.status(200);
        res.body.todo.text.should.equal(text);
        res.body.todo.completed.should.be.false;
        expect(res.body.todo.completedAt).to.be.null;
        return done();
      });
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    chai.request(app)
      .get('/users/me')
      // set header
      .set('x-auth', users[0].tokens[0].token)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        res.should.have.status(200);
        res.body._id.should.equal(users[0]._id.toHexString());
        res.body.email.should.equal(users[0].email);
        return done();
      });
  });

  it('should return 401 if not authenticated', (done) => {
    chai.request(app)
      .get('/users/me')
      .end((res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.undefined;
        return done();
      });
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'example@example.com';
    const password = '123mnb!';

    chai.request(app)
      .post('/users')
      .send({ email, password })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        res.should.have.status(200);
        res.headers['x-auth'].should.exist;
        res.body._id.should.exist;
        res.body.email.should.equal(email);
        return User.findOne({ email }).then((user) => {
          user.should.exist;
          user.password.should.not.equal(password);
          done();
        });
      });
  });

  it('should return validation errors if request invalid', (done) => {
    const email = 'abcde';
    const password = '12c';

    chai.request(app)
      .post('/users')
      .send({ email, password })
      .end((res) => {
        res.should.have.status(400);
        return done();
      });
  });

  it('should not create user if email in use', (done) => {
    const password = 'abc123!';

    chai.request(app)
      .post('/users')
      .send({ email: users[0].email, password })
      .end((res) => {
        res.should.have.status(400);
        return done();
      });
  });
});

describe('/POST /users/login', () => {
  it('should login user and create auth token', (done) => {
    chai.request(app)
      .post('/users/login')
      .send({ email: users[1].email, password: users[1].password })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        res.should.have.header('x-auth');
        return User.findById(users[1]._id).then((user) => {
          user.tokens[0].should.include({ access: 'auth', token: res.headers['x-auth'] });
          done();
        }).catch(e => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    chai.request(app)
      .post('/users/login')
      .send({ email: users[1].email, password: 'myPassTest' })
      .end((res) => {
        res.should.have.status(400);
        res.should.not.have.header('x-auth');
        return User.findById(users[1]._id).then((user) => {
          user.tokens.should.be.empty;
          done();
        }).catch(e => done(e));
      });
  });
});
