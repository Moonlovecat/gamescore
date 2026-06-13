const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  gameId: { type: Number, required: true },
  type: { type: String, enum: ['light', 'hard'], required: true },
  username: { type: String, required: true },
  starRating: { type: Number, required: true },
  comment: String,
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  // Light fields
  graphics: Number,
  valueForMoney: Number,
  immersion: Number,
  // Hard fields
  ost: Number,
  controls: Number,
  optimization: Number,
  strategy: Number,
  difficulty: Number,
  accessibility: Number,
  replayability: Number,
  fatigue: Number,
  recommendedFor: String
});

module.exports = mongoose.model('Review', reviewSchema);
