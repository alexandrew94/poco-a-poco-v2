const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: 'Username is already taken!' },
  email: { type: String, required: true, unique: 'Email is already taken!' },
  password: { type: String, required: true },
  instruments: [],
  accountCreated: String
});

userSchema.virtual('pieces', {
  localField: '_id',
  foreignField: 'user',
  ref: 'Piece'
});

userSchema.plugin(require('mongoose-unique-validator'));

userSchema.set('toJSON', {
  virtuals: true,
  transform(doc, json) {
    delete json.password;
    return json;
  }
});

userSchema.methods.validatePassword = function validatePassword(password){
  return bcrypt.compareSync(password, this.password);
};

userSchema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation){
    this._passwordConfirmation = passwordConfirmation;
  });

userSchema
  .virtual('totalPracticed')
  .get(function () {
    if (this.pieces) {
      const totalPracticedArray = this.pieces.map(entry => {
        return entry.totalPracticed;
      });
      return totalPracticedArray.reduce((a, i) => a + i, 0);
    }
  });

userSchema
  .virtual('practiceLog')
  .get(function () {
    const practiceLogObject = {};
    if(this.pieces) {
      this.pieces.forEach(piece => {
        piece.diary.forEach(diaryEntry => {
          if (Object.keys(practiceLogObject).includes(diaryEntry.timeLogged)) {
            practiceLogObject[diaryEntry.timeLogged] += diaryEntry.timePracticed;
          } else {
            practiceLogObject[diaryEntry.timeLogged] = diaryEntry.timePracticed;
          }
        });
      });
      return practiceLogObject;
    }
  });

userSchema
  .virtual('composersLog')
  .get(function () {
    const composersLogObject = {};
    if(this.pieces) {
      this.pieces.forEach(piece => {
        piece.diary.forEach(diaryEntry => {
          if (Object.keys(composersLogObject).includes(piece.composer)) {
            composersLogObject[piece.composer] += diaryEntry.timePracticed;
          } else {
            composersLogObject[piece.composer] = diaryEntry.timePracticed;
          }
        });
      });
      return composersLogObject;
    }
  });

userSchema
  .post('init', function calculateInstruments(){
    if (this.instruments.length) {
      this.instruments.forEach(instrument => {
        let playingTime = 0;
        if (this.pieces) {
          this.pieces.forEach(piece => {
            piece.instrument === instrument.name ? playingTime += piece.totalPracticed : null;
          });
        }
        return Object.assign(instrument, { ...instrument, playingTime });
      });
    }
    return [];
  });


userSchema
  .pre('validate', function checkPassword(next){
    if(this.isModified('password') && this._passwordConfirmation !== this.password){
      this.invalidate('passwordConfirmation', 'does not match');
    }
    if(!this.email.match(/@/)) {
      this.invalidate('email', 'Must be a valid email address');
    }
    next();
  });

userSchema.pre('save', function hashPassword(next){
  if(this.isModified('password')){
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
