import express from 'express';
import userRoutes from './routes/userRoutes';
import accountRoutes from './routes/accountRoutes'
import './database/mongoose';
import dotenv from 'dotenv'
import {logger} from './helpers'
const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
app.use(express.json());

app.use('/user', userRoutes);
app.use('/account', accountRoutes );

app.listen(port,()=>{
    logger.info(`Server listening on port: ${port} at http://localhost:${port}`);
});