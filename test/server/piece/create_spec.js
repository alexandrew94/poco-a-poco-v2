/* global api, describe, it, expect, beforeEach */

const User = require('../../../models/user');
const Piece = require('../../../models/piece');
const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/environment');

let seededUser;
const userData = {
  email: 'a@a',
  username: 'a',
  password: 'a',
  passwordConfirmation: 'a'
};

let token;
describe('POST /users/:id/pieces', () => {
  beforeEach(done => {
    Promise.all([
      User.remove({}),
      Piece.remove({})
    ])
      .then(() => User.create(userData))
      .then(user => {
        seededUser = user;
        token = jwt.sign({ sub: user._id }, secret, { expiresIn: '6h' });
      })
      .then(() => done());
  });

  it('should return a 401 response if there is no token', done => {
    api
      .post(`/api/users/${seededUser._id}/pieces`)
      .send({
        title: 'piece1',
        composer: 'composer1',
        user: seededUser
      })
      .end((err, res) => {
        expect(res.status).to.eq(401);
        done();
      });
  });

  it('should return a 201 response with a token', done => {
    api
      .post(`/api/users/${seededUser._id}/pieces`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'piece1',
        composer: 'composer1',
        user: seededUser
      })
      .end((err, res) => {
        expect(res.status).to.eq(201);
        done();
      });
  });

  it('should return a valid piece object', done => {
    const pieceData = {
      title: 'piece1',
      composer: 'composer1',
      user: seededUser._id.toString()
    };
    api
      .post(`/api/users/${seededUser._id}/pieces`)
      .set('Authorization', `Bearer ${token}`)
      .send(pieceData)
      .end((err, res) => {
        expect(res.body._id).to.be.a('string');
        Object.keys(pieceData).forEach(field => {
          expect(res.body.pieces[0][field]).to.deep.eq(pieceData[field]);
        });
        done();
      });
  });
});
