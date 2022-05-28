import { Router } from 'express';
import { getCollectionController } from './collections.controller';

const router = Router();

router.get('/', getCollectionController as any);

export default router;
