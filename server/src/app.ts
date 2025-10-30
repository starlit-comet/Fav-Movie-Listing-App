import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import favoritesRouter from './routes/favorites';

const app = express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials :true,
    methods:['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders:['Content-Type','Authorization']
}));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/favorites', favoritesRouter);

export default app;
