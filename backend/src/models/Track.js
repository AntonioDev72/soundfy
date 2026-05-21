const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deezerId: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  cover: { type: String },
  preview: { type: String },
  duration: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Track', trackSchema);
