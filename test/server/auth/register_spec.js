/* global api, describe, it, expect, beforeEach */

const User = require('../../../models/user');

const userData = {
  username: 'test',
  email: 'test@test.com',
  password: 'test',
  passwordConfirmation: 'test'
};

describe('POST /register', () => {
  beforeEach(done => {
    User
      .remove({})
      .then(() => done());
  });

  it('should return a 200 response', done => {
    api
      .post('/api/signup')
      .send(userData)
      .expect(200, done);
  });

  it('should return a 422 ValidationError response if passwords do not match', done => {
    api
      .post('/api/signup')
      .send({
        username: 'test',
        email: 'test@test',
        password: 'test',
        passwordConfirmation: 'bad'
      })
      .end((err, res) => {
        expect(res.status).to.eq(422);
        done();
      });
  });

  it('should return a 422 ValidationError response if email is not unique', done => {
    User.create(userData)
      .then(() => {
        api
          .post('/api/signup')
          .send(userData)
          .end((err, res) => {
            expect(res.status).to.eq(422);
            done();
          });
      });
  });

  it('should return a 422 ValidationError response if email is not in the right format', done => {
    User.create(userData)
      .then(() => {
        api
          .post('/api/signup')
          .send({
            username: 'test',
            email: 'bad',
            password: 'test',
            passwordConfirmation: 'test'
          })
          .end((err, res) => {
            expect(res.status).to.eq(422);
            done();
          });
      });
  });

  it('should create a new user', done => {
    api
      .post('/api/signup')
      .send(userData)
      .end(() => {
        User
          .findOne({ email: userData.email })
          .then(user => {
            expect(user).to.be.an('object');
            done();
          });
      });
  });

  it('should return a new user object', done => {
    api
      .post('/api/signup')
      .send(userData)
      .end((err, res) => {
        expect(res.body.user._id).to.exist;
        done();
      });
  });
});
