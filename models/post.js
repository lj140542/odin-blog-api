const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, required: true },
  title: { type: String, required: true, maxLength: 50 },
  content: { type: String, required: true, maxLength: 2000 },
  published: { type: Boolean, default: false },
});

// Virtuals 
PostSchema.virtual('formatted_timestamp').get(function () {
  return DateTime.fromJSDate(this.timestamp).toISODate();
});

PostSchema.virtual("url").get(function () {
  return `/posts/${this._id}`;
});

module.exports = mongoose.model('Post', PostSchema);