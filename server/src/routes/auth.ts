import { Router } from 'express';
import { login, signup, verify } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/verify', requireAuth, verify);

export default router;
