const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const { dbURI } = require('../config/environment');
const User = require('../models/user');
const Piece = require('../models/piece');

mongoose.connect(dbURI, (err, db) => {
  db.dropDatabase();

  let seededUsers = [];

  User.create([{
    email: 'a@a',
    username: 'a',
    password: 'a',
    passwordConfirmation: 'a',
    instruments: [{name: 'violin'}, {name: 'piano'}],
    accountCreated: '2018-05-20'
  }, {
    email: 'b@b',
    username: 'b',
    password: 'b',
    passwordConfirmation: 'b',
    instruments: [{name: 'violin'}],
    accountCreated: '2018-05-20'
  }, {
    email: 'c@c',
    username: 'c',
    password: 'c',
    passwordConfirmation: 'c',
    instruments: [{name: 'violin'}],
    accountCreated: '2018-05-20'
  }])
    .then(users => {
      console.log(`${users.length} users created`);
      seededUsers = users;

      return Piece.create([{
        title: 'piece1',
        composer: 'composer1',
        description: 'description1',
        user: seededUsers[0],
        instrument: 'piano',
        startedAt: '2018-05-28',
        diary: [{
          timeLogged: '2018-05-28',
          timePracticed: 10,
          notes: 'diaryentry1'
        }, {
          timeLogged: '2018-05-27',
          timePracticed: 20,
          notes: 'diaryentry2'
        }]
      }, {
        title: 'piece2',
        composer: 'composer2',
        description: 'description2',
        instrument: 'violin',
        user: seededUsers[0],
        startedAt: '2018-05-24',
        diary: [{
          timeLogged: '2018-05-26',
          timePracticed: 10,
          notes: 'diaryentry3'
        }, {
          timeLogged: '2018-05-25',
          timePracticed: 20,
          notes: 'diaryentry4'
        }]
      }, {
        title: 'piece3',
        composer: 'composer3',
        description: 'description3',
        instrument: 'violin',
        startedAt: '2018-05-24',
        user: seededUsers[1]
      }, {
        title: 'piece4',
        composer: 'composer4',
        description: 'description4',
        instrument: 'violin',
        startedAt: '2018-05-24',
        user: seededUsers[1]
      }])
        .then(users => {
          console.log(`${users.length} users created`);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err))
    .finally(() => mongoose.connection.close());
});
