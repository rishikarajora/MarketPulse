require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const watchlistRoutes = require('./routes/watchlist.routes');
const marketRoutes = require('./routes/market.routes');
const snapshotRoutes = require('./routes/snapshot.routes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/watchlist', watchlistRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/snapshot', snapshotRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MarketPulse backend is running',
  });
});

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`MarketPulse backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();