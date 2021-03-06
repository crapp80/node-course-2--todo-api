/* ignore error when calling the '_id' property on dummyTodos */
/* eslint-disable no-underscore-dangle */

const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const {
  dummyTodos,
  populateTodos,
  users,
  populateUsers,
} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo test';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        return Todo.find({ text }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(e => done(e));
      });
  });

  it('should not create todo with invaild body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }

        return Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch(e => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(dummyTodos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${dummyTodos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    const id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    const id = '123';
    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete a todo by ID', (done) => {
    const id = dummyTodos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        return Todo.findById(id).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch(e => done(e));
      });
  });

  it('should not delete a todo by ID if created by other user', (done) => {
    const id = dummyTodos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err) => {
        if (err) {
          return done(err);
        }
        return Todo.findById(id).then((todo) => {
          expect(todo).toBeDefined();
          done();
        }).catch(e => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    const id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    const id = '123';
    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    const id = dummyTodos[0]._id.toHexString();
    const text = 'Todo changed';

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo).toMatchObject({
          text,
          completed: true,
          completedAt: expect.any(Number),
        });
      })
      .end(done);
  });

  it('should not update the todo if created by other user', (done) => {
    const id = dummyTodos[0]._id.toHexString();
    const text = 'Todo changed';

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: true,
        text,
      })
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    const id = dummyTodos[1]._id.toHexString();
    const text = 'Todo changed';

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: false,
        text,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo).toMatchObject({
          text,
          completed: false,
          completedAt: null,
        });
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      // set header
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'example@example.com';
    const password = '123mnb!';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toEqual(expect.anything());
        expect(res.body._id).toEqual(expect.anything());
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        return User.findOne({ email }).then((user) => {
          expect(user).toEqual(expect.anything());
          expect(user.password).not.toBe(password);
          done();
        }).catch(e => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    const email = 'abcde';
    const password = '12c';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    const password = 'abc123!';

    request(app)
      .post('/users')
      .send({ email: users[0].email, password })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({ email: users[1].email, password: users[1].password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toEqual(expect.anything());
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        return User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth'],
          });
          done();
        }).catch(e => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({ email: users[1].email, password: 'myPassTest' })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeUndefined();
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        return User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch(e => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeUndefined();
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        return User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch(e => done(e));
      });
  });
});
