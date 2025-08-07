import express from 'express';
import userRoutes from './routes/auth.route';
const app = express();

app.use(express.json());

app.use('/api/auth', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello from app!');
});

export default app;  
