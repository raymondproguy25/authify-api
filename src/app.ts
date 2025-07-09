import express from 'express';
import connectDB from"../src/config/database.ts";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to Authify API.' });
});
connectDB.then(() =>{
const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => {
 console.log(`Server runinig on http://localhost:${PORT}`)
 });
});
