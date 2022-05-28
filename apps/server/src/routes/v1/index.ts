import { Router } from 'express';

// Routes
import collectionsRoutes from './collections';
import guildsRoutes from './guilds';
import instructionsRoutes from './instructions';
import tokensRoutes from './tokens';
import usersRoutes from './users';

const router = Router();

router.use('/collections', collectionsRoutes);
router.use('/guilds', guildsRoutes);
router.use('/instructions', instructionsRoutes);
router.use('/tokens', tokensRoutes);
router.use('/users', usersRoutes);

export default router;
