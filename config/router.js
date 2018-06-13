const router = require('express').Router();
const users = require('../controllers/users');
const pieces = require('../controllers/pieces');
const diaries = require('../controllers/diaries');
const wikimedia = require('../controllers/wikimedia');
const secureRoute = require('../lib/secureRoute');

router.route('/users')
  .get(secureRoute, users.index);

router.route('/users/:id')
  .get(secureRoute, users.show);

router.route('/users/:id/edit')
  .put(secureRoute, users.update);

router.route('/signup')
  .post(users.signup);

router.route('/login')
  .post(users.login);

router.route('/users/:id/pieces')
  .get(secureRoute, pieces.index)
  .post(secureRoute, pieces.create);

router.route('/users/:id/pieces/:pieceId')
  .get(secureRoute, pieces.show)
  .put(secureRoute, pieces.update)
  .delete(secureRoute, pieces.delete);

router.route('/users/:id/pieces/:pieceId/diary')
  .post(secureRoute, diaries.create);

router.route('/users/:id/pieces/:pieceId/diary/:diaryId')
  .put(secureRoute, diaries.update)
  .delete(secureRoute, diaries.delete);

router.route('/wikimedia/composers/:name')
  .get(wikimedia.composers);

module.exports = router;
