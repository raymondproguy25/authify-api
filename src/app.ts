/**
 * Authify API - Auth-as-a-Service
 * I'm building from scracth 
 * Raymond Nicholas Pro Guy
 * Free, Open Source, Secure Authentication API
 * Just plug and use no need for extra setup
 */
import express from 'express';
import connectDB from './config/database.ts';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.route.ts";
import dashboardRoute from "./routes/dashboard.route.ts";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/", dashboardRoute);

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to Authify API.' });
});
connectDB().then(() =>{
const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => {
 console.log(`Server runinig on http://localhost:${PORT}`)
 });
});
