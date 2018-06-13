const User = require('../models/user');
const Piece = require('../models/piece'); // eslint-disable-line
const jwt = require('jsonwebtoken');
const { secret } = require('../config/environment');

function index(req, res, next) {
  User
    .find()
    .populate('pieces')
    .then(users => res.json(users))
    .catch(next);
}

function show(req, res, next) {
  User
    .findById(req.params.id)
    .populate('pieces')
    .then(user => res.json(user))
    .catch(next);
}

function update(req, res, next) {
  User
    .findById(req.params.id)
    .then(user => {
      const newUser = user;
      newUser.username = req.body.username;
      newUser.email = req.body.email;
      if (newUser.instruments.length) {
        newUser.instruments = req.body.instruments;
      }
      Object.assign(user, newUser);
      return newUser.save();
    })
    .then(newUser => {
      console.log(newUser);
      res.json(newUser);
    })
    .catch(next);
}

function signup(req, res, next) {
  console.log(req.body);
  User
    .create(req.body)
    .then(user => {
      const token = jwt.sign({ sub: user._id }, secret, { expiresIn: '6h' });
      res.json({
        message: `You've successfully registered, ${user.username}! 👏🎉`,
        token,
        user
      });
    })
    .catch(next);
}

function login(req, res, next) {
  let findBy;
  if (req.body.usernameOrEmail.match(/@/)) {
    findBy = { email: req.body.usernameOrEmail };
  } else {
    findBy = { username: req.body.usernameOrEmail };
  }
  User
    .findOne(findBy)
    .then(user => {
      if(!user || !user.validatePassword(req.body.password)) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const token = jwt.sign({ sub: user._id }, secret, { expiresIn: '6h' });
      res.json({
        message: `Welcome back, ${user.username}! 😊😊`,
        token,
        user
      });
    })
    .catch(next);
}

module.exports = {
  index,
  show,
  update,
  signup,
  login
};
