require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const Game = require('./models/Game');
const Review = require('./models/Review');

const app = express();

app.use(cors());
app.use(express.json());
// 정적 파일은 Vercel이 직접 처리하도록 하지만, 예비용으로 둡니다.
app.use(express.static(path.join(__dirname, 'public')));

const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB 연결 관리 (서버리스 최적화)
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  if (!MONGODB_URI) {
    console.error('CRITICAL: MONGODB_URI is missing!');
    throw new Error('MONGODB_URI environment variable is not defined');
  }
  const db = await mongoose.connect(MONGODB_URI);
  cachedDb = db;
  return db;
}

// API 요청 시에만 DB 연결
const dbMiddleware = async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
};

// API Routes
app.get('/api/games', dbMiddleware, async (req, res) => {
  try {
    const games = await Game.find().sort({ id: 1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews', dbMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews/:gameId', dbMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ gameId: parseInt(req.params.gameId) });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', dbMiddleware, async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 루트 요청 등 일반 요청은 index.html 반환
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
