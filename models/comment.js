const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: { type: String, required: true },
  timestamp: { type: Date, required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  content: { type: String, required: true, maxLength: 500 },
});

// Virtuals 
CommentSchema.virtual('formatted_timestamp').get(function () {
  return DateTime.fromJSDate(this.timestamp).toISODate();
});

module.exports = mongoose.model('Comment', CommentSchema);