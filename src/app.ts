import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to Authify API.' });
});

const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => {
 console.log(`Server runinig on http://localhost:${PORT}`)
});
