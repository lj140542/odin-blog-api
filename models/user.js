const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String, required: true, maxLength: 50 },
  lastname: { type: String, required: true, maxLength: 50 },
  username: { type: String, required: true, maxLength: 50 },
  password: { type: String, required: true, maxLength: 100 },
});

// Virtuals 
UserSchema.virtual('fullname').get(function () {
  return `${this.firstname} ${this.lastname}`;
});

module.exports = mongoose.model('User', UserSchema);