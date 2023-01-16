import express from 'express';
import { loginForm, registerForm, passwordRecoveryForm, registerUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/login', loginForm);
router.get('/register', registerForm);
router.post('/register', registerUser)
router.get('/password-recovery', passwordRecoveryForm);

export default router;