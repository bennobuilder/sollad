import { Router } from 'express';
import config from '../config';

// Routes
import v1Routes from './v1';

const router = Router();

router.use('/v1', v1Routes);
router.use('/info', (req, res) => {
  try {
    res.send({
      version: config.app.packageVersion,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

export default router;
