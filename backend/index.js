import dotenv from 'dotenv';
dotenv.config({ path: './env/.env' });
import app from './src/app.js';
import connectDB from './config/db.config.js';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
