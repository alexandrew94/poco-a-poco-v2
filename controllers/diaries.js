const Piece = require('../models/piece');

function diariesCreate(req, res, next) {
  Piece
    .findById(req.params.pieceId)
    .then(piece => {
      piece.diary.push(req.body);
      return piece.save();
    })
    .then(piece => res.status(201).json(piece))
    .catch(next);
}

function diariesUpdate(req, res, next) {
  Piece
    .findById(req.params.pieceId)
    .then(piece => {
      piece.diary.forEach(entry => {
        entry._id.toString() === req.params.diaryId ? Object.assign(entry, req.body) : null;
      });
      return piece.save();
    })
    .then(piece => {
      let newEntry;
      piece.diary.forEach(entry => {
        entry._id.toString() === req.params.diaryId ? newEntry = entry : null;
      });
      res.status(200).json(newEntry);
    })
    .catch(next);
}

function diariesDelete(req, res, next) {
  Piece
    .findById(req.params.pieceId)
    .then(piece => {
      piece.diary.forEach(entry => {
        entry._id.toString() === req.params.diaryId ? entry.remove() : null;
      });
      return piece.save();
    })
    .then(() => res.status(204).json({ message: 'Deletion successful' }))
    .catch(next);
}

module.exports = {
  create: diariesCreate,
  update: diariesUpdate,
  delete: diariesDelete
};
