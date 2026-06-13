const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  platform: String,
  genre: String,
  year: Number,
  icon: String,
  gradient: String
});

module.exports = mongoose.model('Game', gameSchema);
