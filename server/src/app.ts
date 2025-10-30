import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import favoritesRouter from './routes/favorites';
import { CORS_ORIGIN } from './config/env';

const app = express();

app.use(cors({
    origin: CORS_ORIGIN,
    credentials :true,
    methods:['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders:['Content-Type','Authorization']
}));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/favorites', favoritesRouter);

export default app;
