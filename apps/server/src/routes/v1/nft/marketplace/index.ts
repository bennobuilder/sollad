import { Router } from 'express';

// Routes
import magicedenRoutes from './magiceden';

const router = Router();

router.use('/me', magicedenRoutes);

export default router;
