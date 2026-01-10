import express from 'express';
import cors from 'cors';
import { config } from './config/environment.js';
import { routes } from './routes/index.js';

const app = express();
app.use(cors());
app.use(routes);

app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
});

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
