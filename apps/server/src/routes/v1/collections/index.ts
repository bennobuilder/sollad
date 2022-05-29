import { Router } from 'express';
import { getCollectionController } from './collections.controller';

const router = Router();

router.get('/:symbol', getCollectionController as any);

export * from './collections.types';
export default router;
