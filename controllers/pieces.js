const Piece = require('../models/piece');
const User = require('../models/user');

function piecesIndex(req, res, next) {
  User
    .findById(req.currentUser._id)
    .populate('pieces')
    .then(user => {
      return res.json(user.pieces);
    })
    .catch(next);
}

function piecesCreate(req, res, next) {
  req.body.user = req.currentUser;
  Piece
    .create(req.body)
    .then(() => {
      User
        .findById(req.currentUser._id)
        .populate('pieces')
        .then(user => res.status(201).json(user));
    })
    .catch(next);
}

function piecesShow(req, res, next) {
  Piece
    .findById(req.params.pieceId)
    .then(piece => res.json(piece))
    .catch(next);
}

function piecesUpdate(req, res, next) {
  Piece
    .findById(req.params.pieceId)
    .then(piece => {
      piece = Object.assign(piece, req.body);
      return piece.save();
    })
    .then(piece => {
      return res.status(201).json(piece);
    })
    .catch(next);
}

function piecesDelete(req, res, next) {
  Piece
    .findById(req.params.pieceId)
    .then(piece => {
      return piece.remove();
    })
    .then(() => res.sendStatus(204).json({
      message: 'Piece successfully deleted!'
    }))
    .catch(next);
}

module.exports = {
  index: piecesIndex,
  create: piecesCreate,
  show: piecesShow,
  update: piecesUpdate,
  delete: piecesDelete
};
