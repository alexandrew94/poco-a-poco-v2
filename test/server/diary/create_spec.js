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
let seededPiece;
const pieceData = {
  title: 'piece1',
  composer: 'composer1',
  instrument: 'violin',
  user: seededUser
};
let token;

describe('POST /users/:id/pieces/:pieceid/diary', () => {
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
      .then(piece => {
        seededPiece = piece;
      })
      .then(() => done());
  });

  it('should return a 401 response if there is no token', done => {
    api
      .post(`/api/users/${seededUser._id}/pieces/${seededPiece._id}/diary`)
      .send({
        timeLogged: '2018-05-28',
        timePracticed: 10,
        notes: 'diaryentry1',
        shortNotes: 'diaryentry1'
      })
      .end((err, res) => {
        expect(res.status).to.eq(401);
        done();
      });
  });

  it('should return a 201 response with a token', done => {
    api
      .post(`/api/users/${seededUser._id}/pieces/${seededPiece._id}/diary`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        timeLogged: '2018-05-28',
        timePracticed: 10,
        notes: 'diaryentry1',
        shortNotes: 'diaryentry1'
      })
      .end((err, res) => {
        expect(res.status).to.eq(201);
        done();
      });
  });

  it('should return a valid piece object with new diary entry in it', done => {
    const diaryData = {
      timeLogged: '2018-05-28',
      timePracticed: 10,
      notes: 'diaryentry1',
      shortNotes: 'diaryentry1'
    };
    api
      .post(`/api/users/${seededUser._id}/pieces/${seededPiece._id}/diary`)
      .set('Authorization', `Bearer ${token}`)
      .send(diaryData)
      .end((err, res) => {
        expect(res.body._id).to.be.a('string');
        Object.keys(diaryData).forEach(field => {
          expect(res.body.diary[0][field]).to.deep.eq(diaryData[field]);
        });
        done();
      });
  });
});
