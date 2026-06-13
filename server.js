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
app.use(express.static('public'));

const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB 연결 관리 (Vercel 서버리스 최적화)
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in Vercel settings');
  }
  const db = await mongoose.connect(MONGODB_URI);
  cachedDb = db;
  return db;
}

// 미들웨어: 모든 API 요청 전에 DB 연결 확인
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    try {
      await connectToDatabase();
      next();
    } catch (err) {
      console.error('DB Connection Error:', err);
      res.status(500).json({ error: 'Database connection failed' });
    }
  } else {
    next();
  }
});

// API Routes
app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find().sort({ id: 1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews/:gameId', async (req, res) => {
  try {
    const reviews = await Review.find({ gameId: parseInt(req.params.gameId) });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 클라이언트 사이드 라우팅 처리 (에러 원인 수정: '*' -> '/*')
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 로컬 실행을 위한 코드
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
