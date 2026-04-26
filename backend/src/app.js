import express from 'express';
import authRoutes from '../routes/auth.routes.js';
import problemRoutes from '../routes/problem.routes.js';
import submissionRoutes from '../routes/submission.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);

export default app;
