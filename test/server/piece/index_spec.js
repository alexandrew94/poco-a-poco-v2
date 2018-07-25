/* global api, describe, it, expect, beforeEach */
const User = require('../../../models/user');
const Piece = require('../../../models/piece');
const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/environment');

let seededUsers;
const userData = [{
  email: 'a@a',
  username: 'a',
  password: 'a',
  passwordConfirmation: 'a'
}, {
  email: 'b@b',
  username: 'b',
  password: 'b',
  passwordConfirmation: 'b'
}, {
  email: 'c@c',
  username: 'c',
  password: 'c',
  passwordConfirmation: 'c'
}];

let token;

describe('GET /users/:id/pieces', () => {
  beforeEach(done => {
    User.remove({})
      .then(() => User.create(userData))
      .then(users => {
        token = jwt.sign({ sub: users[0]._id }, secret, { expiresIn: '6h' });
        seededUsers = users;
        return Piece.create([{
          title: 'piece1',
          composer: 'composer1',
          instrument: 'violin',
          user: seededUsers[0]
        }, {
          title: 'piece2',
          composer: 'composer2',
          instrument: 'violin',
          user: seededUsers[0]
        }, {
          title: 'piece3',
          composer: 'composer3',
          instrument: 'violin',
          user: seededUsers[1]
        }, {
          title: 'piece4',
          composer: 'composer4',
          instrument: 'violin',
          user: seededUsers[1]
        }]);
      })
      .then(() => done());
  });

  it('should return a 200 response', done => {
    api
      .get(`/api/users/${seededUsers[0]._id}/pieces`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
  });

  it('should return an array', done => {
    api
      .get(`/api/users/${seededUsers[0]._id}/pieces`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should return an array of valid piece objects', done => {
    api
      .get(`/api/users/${seededUsers[0]._id}/pieces`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.body
          .forEach((piece, index) => {
            const pieceData = [{
              title: 'piece1',
              composer: 'composer1',
              instrument: 'violin',
              user: seededUsers[0]._id.toString()
            }, {
              title: 'piece2',
              composer: 'composer2',
              instrument: 'violin',
              user: seededUsers[0]._id.toString()
            }, {
              title: 'piece3',
              composer: 'composer3',
              instrument: 'violin',
              user: seededUsers[1]._id.toString()
            }, {
              title: 'piece4',
              composer: 'composer4',
              instrument: 'violin',
              user: seededUsers[1]._id.toString()
            }];
            Object.keys(pieceData[index]).forEach(field => {
              expect(piece[field]).to.deep.eq(pieceData[index][field]);
            });
          });
        done();
      });
  });

});
