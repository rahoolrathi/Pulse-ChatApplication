import express from 'express';

const app = express();

app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('Hello from app!');
});

export default app;  // <--- This line is **required** for `import app from './app';` to work
