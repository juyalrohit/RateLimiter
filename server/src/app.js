import express from 'express'
import { sendRequestRouter } from './routes/index.route.js';

const app = express();

app.use(express.json());

app.use('/', sendRequestRouter);

export default app;
