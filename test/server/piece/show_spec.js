/* global api, describe, it, expect, beforeEach */

const Piece = require('../../../models/piece');
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/environment');

const userData = {
  email: 'a@a',
  username: 'a',
  password: 'a',
  passwordConfirmation: 'a'
};

let seededUser;
let seededPiece;
let token;

describe('GET /users/:id/piece/:pieceId', () => {
  beforeEach(done => {
    User.remove({})
      .then(() => User.create(userData))
      .then(user => {
        token = jwt.sign({ sub: user._id }, secret, { expiresIn: '6h' });
        seededUser = user;
        return Piece.create({
          title: 'piece1',
          composer: 'composer1',
          user: seededUser
        });
      })
      .then(piece => {
        seededPiece = piece;
      })
      .then(() => done());
  });

  it('should return a 200 response', done => {
    api
      .get(`/api/users/${seededUser._id}/pieces/${seededPiece._id}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
  });

  it('should return an object as a response body', done => {
    api
      .get(`/api/users/${seededUser._id}/pieces/${seededPiece._id}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
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
