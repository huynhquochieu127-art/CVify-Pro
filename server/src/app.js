// server/src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import cvRoutes from './routes/cvRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    thanh_cong: true,
    thong_bao: 'CV Builder API đang hoạt động ổn định!',
    thoi_gian: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server Backend đang chạy tại: http://localhost:${PORT}`);
});
