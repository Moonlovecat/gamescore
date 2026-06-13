require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('./models/Game');
const Review = require('./models/Review');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamescore';

const GAMES = [
  { id: 1,  title: "슈퍼 마리오 갤럭시",           platform: "Nintendo Switch", genre: "플랫포머",      year: 2021, icon: "🌌", gradient: "linear-gradient(145deg,#1a237e,#7986cb)" },
  { id: 2,  title: "메트로이드 프라임 비욘드",      platform: "Nintendo Switch", genre: "액션 어드벤처", year: 2025, icon: "🔵", gradient: "linear-gradient(145deg,#004d40,#26a69a)" },
  { id: 3,  title: "메트로이드 드레드",             platform: "Nintendo Switch", genre: "액션",          year: 2021, icon: "⚡", gradient: "linear-gradient(145deg,#b71c1c,#e53935)" },
  { id: 4,  title: "젤다의 전설: 야생의 숨결",      platform: "Nintendo Switch", genre: "오픈월드",      year: 2017, icon: "🌿", gradient: "linear-gradient(145deg,#1b5e20,#66bb6a)" },
  { id: 5,  title: "슈퍼 마리오 오디세이",          platform: "Nintendo Switch", genre: "플랫포머",      year: 2017, icon: "🎩", gradient: "linear-gradient(145deg,#b71c1c,#ff7043)" },
  { id: 6,  title: "동킹콩 바나나자",               platform: "Nintendo Switch", genre: "플랫포머",      year: 2025, icon: "🍌", gradient: "linear-gradient(145deg,#e65100,#ffa726)" },
  { id: 7,  title: "별의 커비 디스커버리",          platform: "Nintendo Switch", genre: "액션",          year: 2022, icon: "🌸", gradient: "linear-gradient(145deg,#880e4f,#f48fb1)" },
  { id: 8,  title: "스플래툰 3",                   platform: "Nintendo Switch", genre: "슈터",          year: 2022, icon: "🦑", gradient: "linear-gradient(145deg,#827717,#cddc39)" },
  { id: 9,  title: "젤다의 전설: 왕국의 눈물",      platform: "Nintendo Switch", genre: "오픈월드",      year: 2023, icon: "👁️", gradient: "linear-gradient(145deg,#4a148c,#ce93d8)" },
  { id: 10, title: "포켓몬 스칼렛/바이올렛",        platform: "Nintendo Switch", genre: "RPG",           year: 2022, icon: "⚔️", gradient: "linear-gradient(145deg,#880e4f,#f06292)" },
  { id: 11, title: "닌텐도 스위치 스포츠",          platform: "Nintendo Switch", genre: "스포츠",        year: 2022, icon: "🏅", gradient: "linear-gradient(145deg,#006064,#4dd0e1)" },
  { id: 12, title: "마리오 카트 8 디럭스",          platform: "Nintendo Switch", genre: "레이싱",        year: 2017, icon: "🏎️", gradient: "linear-gradient(145deg,#1565c0,#42a5f5)" },
  { id: 13, title: "피크민 4",                     platform: "Nintendo Switch", genre: "전략",          year: 2023, icon: "🌱", gradient: "linear-gradient(145deg,#33691e,#aed581)" },
  { id: 14, title: "파이어 엠블렘 인게이지",        platform: "Nintendo Switch", genre: "SRPG",          year: 2023, icon: "♟️", gradient: "linear-gradient(145deg,#880e4f,#e91e63)" },
  { id: 15, title: "몬스터 헌터 라이즈",            platform: "Nintendo Switch", genre: "액션 RPG",      year: 2021, icon: "🐉", gradient: "linear-gradient(145deg,#3e2723,#8d6e63)" },
  { id: 16, title: "제노블레이드 크로니클스 3",     platform: "Nintendo Switch", genre: "JRPG",          year: 2022, icon: "🗡️", gradient: "linear-gradient(145deg,#1a237e,#5c6bc0)" },
  { id: 17, title: "스타듀 밸리",                  platform: "Nintendo Switch", genre: "시뮬레이션",    year: 2017, icon: "🌾", gradient: "linear-gradient(145deg,#2e7d32,#81c784)" },
  { id: 18, title: "하데스",                       platform: "Nintendo Switch", genre: "로그라이크",    year: 2021, icon: "💀", gradient: "linear-gradient(145deg,#4a148c,#7b1fa2)" },
  { id: 19, title: "링 피트 어드벤처",             platform: "Nintendo Switch", genre: "피트니스",      year: 2019, icon: "💪", gradient: "linear-gradient(145deg,#0d47a1,#42a5f5)" },
  { id: 20, title: "루이지 맨션 3",                platform: "Nintendo Switch", genre: "어드벤처",      year: 2019, icon: "👻", gradient: "linear-gradient(145deg,#1b5e20,#388e3c)" },
];

const SEED_REVIEWS = {
  4: [
    { type: 'hard', username: '프로게이머K', starRating: 5, comment: "오픈월드의 혁명. 탐험 하나하나가 보상처럼 느껴졌다. 지금까지 해본 게임 중 가장 자유로운 경험이었다.", ost: 5, controls: 4, optimization: 5, strategy: 3, difficulty: 3, accessibility: 4, replayability: 5, fatigue: 2, recommendedFor: "오픈월드 입문자부터 하드코어 팬까지 모두", graphics: null, valueForMoney: null, immersion: null, date: "2025-03-12" },
    { type: 'light', username: '닌텐도초보', starRating: 5, comment: "처음 게임 켰을 때 펼쳐지는 하이랄 평원 보고 진짜 소름 돋음. 200시간 했는데도 아직도 갈 곳이 있음.", graphics: 5, valueForMoney: 5, immersion: 5, ost: null, controls: null, optimization: null, strategy: null, difficulty: null, accessibility: null, replayability: null, fatigue: null, recommendedFor: null, date: "2025-04-01" },
  ],
  9: [
    { type: 'hard', username: 'ZeldaFan99', starRating: 5, comment: "야숨을 뛰어넘을 수 없을 것 같았는데 뛰어넘었다. 지하 세계와 하늘 섬의 설계가 정말 대단하다. 빌드 시스템은 최고.", ost: 5, controls: 5, optimization: 4, strategy: 5, difficulty: 4, accessibility: 3, replayability: 5, fatigue: 3, recommendedFor: "야숨 좋아했던 사람, 샌드박스 마니아", graphics: null, valueForMoney: null, immersion: null, date: "2025-02-20" },
  ],
  5: [
    { type: 'light', username: '마리오러버', starRating: 5, comment: "마리오 게임 중 역대급. 여행하는 느낌이 너무 좋았고 각 나라마다 분위기가 완전히 달라서 질리지 않았어요.", graphics: 5, valueForMoney: 4, immersion: 5, ost: null, controls: null, optimization: null, strategy: null, difficulty: null, accessibility: null, replayability: null, fatigue: null, recommendedFor: null, date: "2025-01-15" },
    { type: 'hard', username: '플랫포머장인', starRating: 4, comment: "조작감이 너무 좋고 Moon 수집 욕구가 강하게 생긴다. 다만 전체적인 난이도가 낮아서 아쉬움.", ost: 5, controls: 5, optimization: 5, strategy: 2, difficulty: 2, accessibility: 5, replayability: 3, fatigue: 1, recommendedFor: "캐주얼 게이머, 패밀리 게이밍", graphics: null, valueForMoney: null, immersion: null, date: "2025-03-05" },
  ],
  18: [
    { type: 'hard', username: '로그라이크매니아', starRating: 5, comment: "죽을수록 더 강해지는 메커니즘을 이렇게 재미있게 풀어낸 게임이 있을까. 내러티브와 게임플레이의 완벽한 융합.", ost: 5, controls: 5, optimization: 5, strategy: 5, difficulty: 4, accessibility: 3, replayability: 5, fatigue: 3, recommendedFor: "도전을 즐기는 게이머, 스토리 좋아하는 사람", graphics: null, valueForMoney: null, immersion: null, date: "2025-04-10" },
  ],
  15: [
    { type: 'hard', username: '헌터MasterG', starRating: 4, comment: "솔로도 멀티도 재밌다. 와이어버그 이동이 너무 자유로워서 맵 탐색 자체가 즐겁다. 다만 엔드게임 콘텐츠가 아쉬움.", ost: 4, controls: 5, optimization: 4, strategy: 4, difficulty: 4, accessibility: 3, replayability: 4, fatigue: 3, recommendedFor: "액션 RPG 좋아하는 게이머, 멀티 선호자", graphics: null, valueForMoney: null, immersion: null, date: "2025-02-01" },
  ],
  12: [
    { type: 'light', username: '레이싱초보', starRating: 5, comment: "친구들과 파티 게임으로 최고. 밸런스 잘 잡혀있고 트랙 수가 엄청 많아서 질리질 않아요.", graphics: 4, valueForMoney: 5, immersion: 4, ost: null, controls: null, optimization: null, strategy: null, difficulty: null, accessibility: null, replayability: null, fatigue: null, recommendedFor: null, date: "2025-03-22" },
  ],
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Game.deleteMany({});
    await Review.deleteMany({});

    await Game.insertMany(GAMES);
    console.log('Games seeded');

    const reviewsToInsert = [];
    for (const gameId in SEED_REVIEWS) {
      SEED_REVIEWS[gameId].forEach(r => {
        reviewsToInsert.push({ ...r, gameId: parseInt(gameId) });
      });
    }
    await Review.insertMany(reviewsToInsert);
    console.log('Reviews seeded');

    await mongoose.disconnect();
    console.log('Seeding complete');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
