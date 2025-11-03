import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import inventoryRoutes from './routes/inventory.js';
import { errorHandler } from './middleware/errorHandler.js';
import { timingMiddleware } from './middleware/timing.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(timingMiddleware);

app.use('/api', apiRoutes);
app.use('/api/inventory', inventoryRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API Console server running on http://localhost:${PORT}`);
});
