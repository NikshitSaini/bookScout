import express from 'express';
import "dotenv/config";
import cors from 'cors';
import job from './lib/cron.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import {connectDB} from './lib/db.js';

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
job.start();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});