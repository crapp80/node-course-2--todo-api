/* disable eslint errors for test syntax */
/* eslint-disable no-undef */

const expect = require('expect');
const request = require('supertest');

const { app } = require('../server.js');
const { Todo } = require('../models/todo.js');

// make sure the database is empty before every request
beforeEach((done) => {
  Todo.remove().then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo test';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        return Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(e => done(e));
      });
  });

  it('should not create todo with invaild body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }

        return Todo.find().then((todos) => {
          expect(todos.length).toBe(0);
          done();
        }).catch(e => done(e));
      });
  });
});
