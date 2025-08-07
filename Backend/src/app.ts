import express from 'express';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello from app!');
});

export default app;  
