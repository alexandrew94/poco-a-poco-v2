/* global api, describe, it, expect, beforeEach */

const User = require('../../../models/user');
const Piece = require('../../../models/piece');
const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/environment');

let seededUser;
let seededPiece;

const userData = {
  email: 'a@a',
  username: 'a',
  password: 'a',
  passwordConfirmation: 'a'
};

const pieceData = {
  title: 'piece1',
  composer: 'composer1',
  user: seededUser
};

let token;
describe('UPDATE /users/:id/pieces/:pieceId', () => {
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
      .then(() => Piece.create(pieceData))
      .then(piece => seededPiece = piece)
      .then(() => done());
  });

  it('should return a 401 response if there is no token', done => {
    api
      .put(`/api/users/${seededUser._id}/pieces/${pieceData._id}`)
      .send({
        title: 'changed',
        composer: 'changed',
        user: seededUser
      })
      .end((err, res) => {
        expect(res.status).to.eq(401);
        done();
      });
  });

  it('should return a 201 response with a token', done => {
    api
      .put(`/api/users/${seededUser._id}/pieces/${seededPiece._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'changed',
        composer: 'changed',
        user: seededUser
      })
      .end((err, res) => {
        expect(res.status).to.eq(201);
        done();
      });
  });

  it('should return a valid piece object that has been edited correctly', done => {
    const pieceData = {
      title: 'changed',
      composer: 'changed',
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
