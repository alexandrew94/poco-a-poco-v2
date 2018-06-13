const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  timeLogged: String,
  timePracticed: { type: Number, required: 'Please enter a valid time' },
  notes: String
});

const pieceSchema = new mongoose.Schema({
  title: { type: String, required: 'Title is required' },
  composer: String,
  description: String,
  instrument: { type: String, required: 'Instrument is required'},
  startedAt: String,
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  diary: [ diarySchema ]
});

diarySchema.set('toJSON', {
  virtuals: true
});

diarySchema
  .virtual('shortNotes')
  .get(function(){
    if (this.notes) {
      return this.notes.length > 50 ? this.notes.substring(0, 50) + '...' : this.notes;
    }
  });

pieceSchema.set('toJSON', {
  virtuals: true
});

pieceSchema
  .virtual('totalPracticed')
  .get(function() {
    const minutesArray = this.diary.map(entry => entry.timePracticed);
    return minutesArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  });

pieceSchema
  .virtual('shortDescription')
  .get(function(){
    if (this.description) {
      return this.description.length > 50 ? this.description.substring(0, 50) + '...' : this.description;
    }
  });

module.exports = mongoose.model('Piece', pieceSchema);
